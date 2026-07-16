console.log("PROCUREMENT AGENT LOADED");

function chooseBestSupplier(boq, suppliers) {
  let bestSupplier = null;
  let lowestCost = Infinity;

  const supplierResults = [];

  suppliers.forEach((supplier) => {
    const supplierName =
      supplier.companyName || supplier.supplier;

    const trusted =
      supplier.trusted !== undefined
        ? supplier.trusted
        : true;

    if (!trusted) return;

    const cementPrice =
      Number(supplier.cement ?? supplier.cementPrice ?? 0);

    const steelPrice =
      Number(supplier.steel ?? supplier.steelPrice ?? 0);

    const blockPrice =
      Number(supplier.blocks ?? supplier.blockPrice ?? 0);

    const wallet =
      supplier.wallet || supplier.walletAddress || "";

    const totalCost = Number(
      (
        boq.cement * cementPrice +
        boq.steel * steelPrice +
        boq.blocks * blockPrice
      ).toFixed(2)
    );

    const result = {
      id: supplier.id,                 // ✅ VERY IMPORTANT
      supplier: supplierName,
      companyName: supplierName,
      trusted,
      totalCost,
      wallet,
      walletAddress: wallet,
    };

    supplierResults.push(result);

    if (totalCost < lowestCost) {
      lowestCost = totalCost;
      bestSupplier = result;
    }
  });

  const marketPrice = Math.max(
  ...supplierResults.map(
    supplier => supplier.totalCost
  )
);


return {
  bestSupplier,
  supplierResults,
  marketPrice,
};
}

export default chooseBestSupplier;