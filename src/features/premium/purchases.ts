import { NativeModules, Platform } from 'react-native';
import type { CustomerInfo, PurchasesPackage, PurchasesStoreProduct, SubscriptionOption } from 'react-native-purchases';

import { usePremiumStore } from './store';

/**
 * Compras con Google Play vía RevenueCat (PRD §4). Configuración en la tienda (docs/setup/HITO_3.md):
 * - Suscripción `premium` con plan base `mensual` ($3.990) y oferta `fin-prueba` (50 % el primer mes).
 * - Productos únicos `pase_paes` ($12.990) y `pase_paes_oferta` ($6.495). NO van en el entitlement: su vigencia
 *   ("hasta tu próxima PAES") la calcula la app con `engine/premium.passUntil`.
 * - Entitlement `premium` (solo la suscripción). Offering `default` con los paquetes `$rc_monthly` y `pase`;
 *   offering `fin_prueba` con `pase` → `pase_paes_oferta`.
 */
const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
const ENTITLEMENT = 'premium';
const OFFER_TAG = 'fin-prueba';
const PASS_PREFIX = 'pase_paes';

type PurchasesModule = typeof import('react-native-purchases').default;

let mod: PurchasesModule | null = null;
let configured = false;

/**
 * Disponible solo en Android con el módulo nativo (el build de desarrollo anterior no lo trae) y con la clave.
 * Sin esto, la app muestra los precios y explica que la compra llega en la próxima versión.
 */
export function purchasesAvailable(): boolean {
  return Platform.OS === 'android' && !!API_KEY && !!NativeModules.RNPurchases;
}

function purchases(): PurchasesModule | null {
  if (!purchasesAvailable()) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- carga diferida: solo con el módulo nativo presente
  if (!mod) mod = (require('react-native-purchases') as typeof import('react-native-purchases')).default;
  if (!configured) {
    mod.configure({ apiKey: API_KEY! });
    mod.addCustomerInfoUpdateListener(applyCustomerInfo);
    configured = true;
  }
  return mod;
}

/** Traduce la información de la tienda al estado local (suscripción y pase). */
export function applyCustomerInfo(info: CustomerInfo) {
  const store = usePremiumStore.getState();
  const sub = info.entitlements.all[ENTITLEMENT];
  // Vencida o no, se guarda la fecha: `planState` la compara con hoy.
  store.setSubscription(sub?.expirationDate ?? null);
  const pass = info.nonSubscriptionTransactions
    .filter((t) => t.productIdentifier.startsWith(PASS_PREFIX))
    .sort((a, b) => (a.purchaseDate < b.purchaseDate ? 1 : -1))[0];
  if (pass) store.setPass(pass.purchaseDate);
}

/** Identifica al comprador con el id de Supabase (así el webhook y la restauración con Google coinciden). */
export async function identify(userId: string | null) {
  const p = purchases();
  if (!p || !userId) return;
  try {
    const { customerInfo } = await p.logIn(userId);
    applyCustomerInfo(customerInfo);
  } catch {
    // Sin red: se reintenta en el próximo arranque.
  }
}

export async function refreshCustomerInfo() {
  const p = purchases();
  if (!p) return;
  try {
    applyCustomerInfo(await p.getCustomerInfo());
  } catch {
    // Sin red.
  }
}

export type Plans = {
  monthly: { pkg: PurchasesPackage; price: string; offer: SubscriptionOption | null; offerPrice: string | null } | null;
  pass: { product: PurchasesStoreProduct; pkg: PurchasesPackage; price: string } | null;
  passOffer: { pkg: PurchasesPackage; price: string } | null;
};

export async function loadPlans(): Promise<Plans | null> {
  const p = purchases();
  if (!p) return null;
  const offerings = await p.getOfferings();
  const def = offerings.current ?? offerings.all.default;
  const monthlyPkg = def?.monthly ?? null;
  const offer = monthlyPkg?.product.subscriptionOptions?.find((o) => o.tags.includes(OFFER_TAG)) ?? null;
  const firstPhase = offer?.pricingPhases.find((ph) => ph.price.amountMicros > 0) ?? offer?.pricingPhases[0];
  const passPkg = def?.availablePackages.find((x) => x.identifier === 'pase') ?? null;
  const passOfferPkg = offerings.all.fin_prueba?.availablePackages.find((x) => x.identifier === 'pase') ?? null;
  return {
    monthly: monthlyPkg
      ? { pkg: monthlyPkg, price: monthlyPkg.product.priceString, offer, offerPrice: firstPhase?.price.formatted ?? null }
      : null,
    pass: passPkg ? { product: passPkg.product, pkg: passPkg, price: passPkg.product.priceString } : null,
    passOffer: passOfferPkg ? { pkg: passOfferPkg, price: passOfferPkg.product.priceString } : null,
  };
}

export type BuyResult = 'ok' | 'cancelled' | 'error' | 'unavailable';

/** Compra con el precio a la vista (la hoja de Google Play muestra el total antes de pagar). */
export async function buy(target: { pkg: PurchasesPackage } | { option: SubscriptionOption }): Promise<BuyResult> {
  const p = purchases();
  if (!p) return 'unavailable';
  try {
    const res = 'pkg' in target ? await p.purchasePackage(target.pkg) : await p.purchaseSubscriptionOption(target.option);
    applyCustomerInfo(res.customerInfo);
    return 'ok';
  } catch (e) {
    return (e as { userCancelled?: boolean | null }).userCancelled ? 'cancelled' : 'error';
  }
}

export async function restore(): Promise<BuyResult> {
  const p = purchases();
  if (!p) return 'unavailable';
  try {
    applyCustomerInfo(await p.restorePurchases());
    return 'ok';
  } catch {
    return 'error';
  }
}
