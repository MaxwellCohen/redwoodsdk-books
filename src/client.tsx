import { initClient, initClientNavigation } from 'rwsdk/client';
import { setNavigationPending } from '@/lib/navigation-status';

// RedwoodSDK uses RSC RPC to emulate client side navigation.
// https://docs.rwsdk.com/guides/frontend/client-side-nav/
const navigation = initClientNavigation({
  onNavigate: () => setNavigationPending(true),
});

initClient({
  handleResponse: navigation.handleResponse,
  onHydrated: meta => {
    navigation.onHydrated(meta);
    setNavigationPending(false);
  },
});
