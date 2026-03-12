import { CONFIG } from 'src/config-global';

import { ProductsView } from 'src/sections/listeners/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <ProductsView />
    </>
  );
}
