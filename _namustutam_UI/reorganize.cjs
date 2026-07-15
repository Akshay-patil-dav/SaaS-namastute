const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

const moves = [
  // Auth
  { src: 'pages/Login.jsx', dest: 'pages/auth/Login.jsx' },
  { src: 'pages/Login.css', dest: 'pages/auth/Login.css' },
  { src: 'pages/LoginNew.css', dest: 'pages/auth/LoginNew.css' },
  { src: 'pages/Register.jsx', dest: 'pages/auth/Register.jsx' },
  { src: 'pages/AcceptInvite.jsx', dest: 'pages/auth/AcceptInvite.jsx' },
  { src: 'pages/Unauthorized.jsx', dest: 'pages/auth/Unauthorized.jsx' },
  { src: 'pages/Unauthorized.css', dest: 'pages/auth/Unauthorized.css' },
  { src: 'pages/OAuth2RedirectHandler.jsx', dest: 'pages/auth/OAuth2RedirectHandler.jsx' },

  // Dashboard
  { src: 'pages/Dashboard.jsx', dest: 'pages/dashboard/Dashboard.jsx' },
  { src: 'pages/Dashboard.css', dest: 'pages/dashboard/Dashboard.css' },
  { src: 'pages/Dashboard2.jsx', dest: 'pages/dashboard/Dashboard2.jsx' },
  { src: 'pages/Dashboard2.css', dest: 'pages/dashboard/Dashboard2.css' },
  { src: 'pages/SalesDashboard.jsx', dest: 'pages/dashboard/SalesDashboard.jsx' },
  { src: 'pages/SalesDashboard.css', dest: 'pages/dashboard/SalesDashboard.css' },

  // Super Admin
  { src: 'pages/SuperDashboard.jsx', dest: 'pages/superadmin/SuperDashboard.jsx' },
  { src: 'pages/super-dashboard.css', dest: 'pages/superadmin/super-dashboard.css' },
  { src: 'pages/SuperCompanies.jsx', dest: 'pages/superadmin/SuperCompanies.jsx' },
  { src: 'pages/super-companies.css', dest: 'pages/superadmin/super-companies.css' },
  { src: 'pages/SuperSubscriptions.jsx', dest: 'pages/superadmin/SuperSubscriptions.jsx' },
  { src: 'pages/super-subscriptions.css', dest: 'pages/superadmin/super-subscriptions.css' },
  { src: 'pages/SuperPackages.jsx', dest: 'pages/superadmin/SuperPackages.jsx' },
  { src: 'pages/super-packages.css', dest: 'pages/superadmin/super-packages.css' },

  // Inventory
  { src: 'pages/Products.jsx', dest: 'pages/inventory/Products.jsx' },
  { src: 'pages/Products.css', dest: 'pages/inventory/Products.css' },
  { src: 'pages/CreateProduct.jsx', dest: 'pages/inventory/CreateProduct.jsx' },
  { src: 'pages/CreateProduct.css', dest: 'pages/inventory/CreateProduct.css' },
  { src: 'pages/EditProduct.jsx', dest: 'pages/inventory/EditProduct.jsx' },
  { src: 'pages/EditProduct.css', dest: 'pages/inventory/EditProduct.css' },
  { src: 'pages/ExpiredProducts.jsx', dest: 'pages/inventory/ExpiredProducts.jsx' },
  { src: 'pages/LowStocks.jsx', dest: 'pages/inventory/LowStocks.jsx' },
  { src: 'pages/ManageStock.jsx', dest: 'pages/inventory/ManageStock.jsx' },
  { src: 'pages/manage-stock.css', dest: 'pages/inventory/manage-stock.css' },
  { src: 'pages/StockAdjustment.jsx', dest: 'pages/inventory/StockAdjustment.jsx' },
  { src: 'pages/stock-adjustment.css', dest: 'pages/inventory/stock-adjustment.css' },
  { src: 'pages/StockTransfer.jsx', dest: 'pages/inventory/StockTransfer.jsx' },
  { src: 'pages/stock-transfer.css', dest: 'pages/inventory/stock-transfer.css' },
  { src: 'pages/Category.jsx', dest: 'pages/inventory/Category.jsx' },
  { src: 'pages/SubCategory.jsx', dest: 'pages/inventory/SubCategory.jsx' },
  { src: 'pages/Brands.jsx', dest: 'pages/inventory/Brands.jsx' },
  { src: 'pages/Units.jsx', dest: 'pages/inventory/Units.jsx' },
  { src: 'pages/VariantAttributes.jsx', dest: 'pages/inventory/VariantAttributes.jsx' },
  { src: 'pages/Warranties.jsx', dest: 'pages/inventory/Warranties.jsx' },
  { src: 'pages/PrintBarcode.jsx', dest: 'pages/inventory/PrintBarcode.jsx' },
  { src: 'pages/PrintQRCode.jsx', dest: 'pages/inventory/PrintQRCode.jsx' },
  { src: 'pages/inventory-pages-custom.css', dest: 'pages/inventory/inventory-pages-custom.css' },

  // Sales
  { src: 'pages/POS.jsx', dest: 'pages/sales/POS.jsx' },
  { src: 'pages/POS.css', dest: 'pages/sales/POS.css' },
  { src: 'pages/PosOrders.jsx', dest: 'pages/sales/PosOrders.jsx' },
  { src: 'pages/OnlineOrders.jsx', dest: 'pages/sales/OnlineOrders.jsx' },
  { src: 'pages/online-orders.css', dest: 'pages/sales/online-orders.css' },
  { src: 'pages/SalesReturn.jsx', dest: 'pages/sales/SalesReturn.jsx' },

  // Purchases
  { src: 'pages/Purchases.jsx', dest: 'pages/purchases/Purchases.jsx' },
  { src: 'pages/AddPurchase.jsx', dest: 'pages/purchases/AddPurchase.jsx' },
  { src: 'pages/AddPurchase.css', dest: 'pages/purchases/AddPurchase.css' },
  { src: 'pages/EditPurchase.jsx', dest: 'pages/purchases/EditPurchase.jsx' },
  { src: 'pages/PurchaseReturn.jsx', dest: 'pages/purchases/PurchaseReturn.jsx' },
  { src: 'pages/AddPurchaseReturn.jsx', dest: 'pages/purchases/AddPurchaseReturn.jsx' },
  { src: 'pages/EditPurchaseReturn.jsx', dest: 'pages/purchases/EditPurchaseReturn.jsx' },

  // Settings
  { src: 'pages/Settings.jsx', dest: 'pages/settings/Settings.jsx' },
  { src: 'pages/settings.css', dest: 'pages/settings/settings.css' },

  // Website
  { src: 'pages/LandingPage.jsx', dest: 'pages/website/LandingPage.jsx' },
  { src: 'pages/LandingPage.css', dest: 'pages/website/LandingPage.css' },
  { src: 'pages/ITPortfolio.jsx', dest: 'pages/website/ITPortfolio.jsx' },
  { src: 'pages/ITPortfolio.css', dest: 'pages/website/ITPortfolio.css' },
  { src: 'pages/Portfolio.css', dest: 'pages/website/Portfolio.css' },
  { src: 'pages/BlogPage.jsx', dest: 'pages/website/BlogPage.jsx' },
  { src: 'pages/BlogPage.css', dest: 'pages/website/BlogPage.css' },
  { src: 'pages/BlogDetail.jsx', dest: 'pages/website/BlogDetail.jsx' },
  { src: 'pages/WebsiteBuilder.jsx', dest: 'pages/website/WebsiteBuilder.jsx' },
  { src: 'pages/WebsiteBuilder.css', dest: 'pages/website/WebsiteBuilder.css' },
  { src: 'pages/PageBuilder.jsx', dest: 'pages/website/PageBuilder.jsx' },

  // Modals - Inventory
  { src: 'components/AddCategoryModal.jsx', dest: 'components/modals/inventory/AddCategoryModal.jsx' },
  { src: 'components/add-category-modal.css', dest: 'components/modals/inventory/add-category-modal.css' },
  { src: 'components/AddBrandModal.jsx', dest: 'components/modals/inventory/AddBrandModal.jsx' },
  { src: 'components/add-brand-modal.css', dest: 'components/modals/inventory/add-brand-modal.css' },
  { src: 'components/AddSubCategoryModal.jsx', dest: 'components/modals/inventory/AddSubCategoryModal.jsx' },
  { src: 'components/add-sub-category-modal.css', dest: 'components/modals/inventory/add-sub-category-modal.css' },
  { src: 'components/AddUnitModal.jsx', dest: 'components/modals/inventory/AddUnitModal.jsx' },
  { src: 'components/add-unit-modal.css', dest: 'components/modals/inventory/add-unit-modal.css' },
  { src: 'components/AddVariantModal.jsx', dest: 'components/modals/inventory/AddVariantModal.jsx' },
  { src: 'components/add-variant-modal.css', dest: 'components/modals/inventory/add-variant-modal.css' },
  { src: 'components/AddWarrantyModal.jsx', dest: 'components/modals/inventory/AddWarrantyModal.jsx' },
  { src: 'components/add-warranty-modal.css', dest: 'components/modals/inventory/add-warranty-modal.css' },
  { src: 'components/BarcodeModal.jsx', dest: 'components/modals/inventory/BarcodeModal.jsx' },
  { src: 'components/barcode-modal.css', dest: 'components/modals/inventory/barcode-modal.css' },
  { src: 'components/QRCodeModal.jsx', dest: 'components/modals/inventory/QRCodeModal.jsx' },
  { src: 'components/qrcode-modal.css', dest: 'components/modals/inventory/qrcode-modal.css' },
  { src: 'components/EditStockModal.jsx', dest: 'components/modals/inventory/EditStockModal.jsx' },
  { src: 'components/AddStockModal.jsx', dest: 'components/modals/inventory/AddStockModal.jsx' },
  { src: 'components/add-stock-modal.css', dest: 'components/modals/inventory/add-stock-modal.css' },
  { src: 'components/ViewStockModal.jsx', dest: 'components/modals/inventory/ViewStockModal.jsx' },
  { src: 'components/EditTransferModal.jsx', dest: 'components/modals/inventory/EditTransferModal.jsx' },
  { src: 'components/AddTransferModal.jsx', dest: 'components/modals/inventory/AddTransferModal.jsx' },
  { src: 'components/add-transfer-modal.css', dest: 'components/modals/inventory/add-transfer-modal.css' },
  { src: 'components/ViewAdjustmentModal.jsx', dest: 'components/modals/inventory/ViewAdjustmentModal.jsx' },
  { src: 'components/AddAdjustmentModal.jsx', dest: 'components/modals/inventory/AddAdjustmentModal.jsx' },
  { src: 'components/add-adjustment-modal.css', dest: 'components/modals/inventory/add-adjustment-modal.css' },
  { src: 'components/ImportTransferModal.jsx', dest: 'components/modals/inventory/ImportTransferModal.jsx' },
  { src: 'components/import-transfer-modal.css', dest: 'components/modals/inventory/import-transfer-modal.css' },

  // Modals - Sales
  { src: 'components/AddPosModal.jsx', dest: 'components/modals/sales/AddPosModal.jsx' },
  { src: 'components/EditPosModal.jsx', dest: 'components/modals/sales/EditPosModal.jsx' },
  { src: 'components/AddSalesModal.jsx', dest: 'components/modals/sales/AddSalesModal.jsx' },
  { src: 'components/add-sales-modal.css', dest: 'components/modals/sales/add-sales-modal.css' },
  { src: 'components/EditSalesModal.jsx', dest: 'components/modals/sales/EditSalesModal.jsx' },
  { src: 'components/ViewSalesModal.jsx', dest: 'components/modals/sales/ViewSalesModal.jsx' },
  { src: 'components/AddSalesReturnModal.jsx', dest: 'components/modals/sales/AddSalesReturnModal.jsx' },
  { src: 'components/add-sales-return-modal.css', dest: 'components/modals/sales/add-sales-return-modal.css' },
  { src: 'components/EditSalesReturnModal.jsx', dest: 'components/modals/sales/EditSalesReturnModal.jsx' },
  { src: 'components/InvoiceModal.jsx', dest: 'components/modals/sales/InvoiceModal.jsx' },
  { src: 'components/invoice-modal.css', dest: 'components/modals/sales/invoice-modal.css' },

  // Modals - Purchases
  { src: 'components/ImportPurchaseModal.jsx', dest: 'components/modals/purchases/ImportPurchaseModal.jsx' },
  { src: 'components/ViewPurchaseModal.jsx', dest: 'components/modals/purchases/ViewPurchaseModal.jsx' },

  // Modals - Common
  { src: 'components/ContextMenu.jsx', dest: 'components/modals/common/ContextMenu.jsx' },
  { src: 'components/DeleteConfirmModal.jsx', dest: 'components/modals/common/DeleteConfirmModal.jsx' },
  { src: 'components/delete-confirm-modal.css', dest: 'components/modals/common/delete-confirm-modal.css' },
  { src: 'components/IconPicker.jsx', dest: 'components/modals/common/IconPicker.jsx' }
];

moves.forEach(({ src, dest }) => {
  const srcPath = path.join(SRC_DIR, src);
  const destPath = path.join(SRC_DIR, dest);
  if (fs.existsSync(srcPath)) {
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.renameSync(srcPath, destPath);
    console.log(`Moved ${src} -> ${dest}`);
  } else {
    console.warn(`File not found: ${src}`);
  }
});

// Since files have moved inside subdirectories, relative imports (like ../components, ./Login.css, ../../api/config)
// need to be adjusted.
// However, the easiest way to adjust this programmatically across ALL files is complex.
// Instead of a regex hack, I will leave the file modifications to a different script or manual grep.
// Let's at least update `App.jsx` automatically since we know the mapping.

let appJsxPath = path.join(SRC_DIR, 'App.jsx');
if (fs.existsSync(appJsxPath)) {
  let content = fs.readFileSync(appJsxPath, 'utf8');
  moves.forEach(({ src, dest }) => {
    if (src.startsWith('pages/') && dest.startsWith('pages/')) {
      const oldImport = `'./${src}'`;
      const newImport = `'./${dest}'`;
      content = content.replace(newImport, oldImport); // undo if previously done? no.
      content = content.replace(oldImport, newImport);
    }
  });
  fs.writeFileSync(appJsxPath, content);
  console.log('App.jsx paths updated.');
}

console.log('Done moving files.');
