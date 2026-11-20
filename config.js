// Innstillinger for nettsiden. Endre disse når Shopify-butikken er klar.
window.OPP = {
  // Adressen til Shopify-butikken (uten skråstrek på slutten).
  // Bruk myshopify-adressen først, og bytt til eget domene (f.eks. https://butikk.opptenningspakken.no) senere.
  shopBase: "https://DIN-BUTIKK.myshopify.com",

  // Siden i Shopify som inneholder Custom Liquid-koden (se mappen shopify/).
  // Kjøpsknappene sender kunden til: shopBase + buyPath + "?pakke=5|10|20"
  buyPath: "/pages/kjop",

  // E-postadressen som vises i bunnen av siden.
  email: "hei@opptenningspakken.no"
};
