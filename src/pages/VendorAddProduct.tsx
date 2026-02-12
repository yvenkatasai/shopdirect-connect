import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Package, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const categoryOptions = [
  "Cement & Construction", "Bricks, Sand & Aggregates", "Electrical Items",
  "Plumbing Supplies", "Hand & Power Tools", "Paint & Accessories",
  "Garden Tools", "Hardware & Fasteners",
];

const VendorAddProduct = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Product type: sell, rent, both
  const [productType, setProductType] = useState<"sell" | "rent" | "both">("sell");

  // Common fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [stock, setStock] = useState("1");
  const [unit, setUnit] = useState("piece");
  const [specs, setSpecs] = useState("");

  // Sell fields
  const [price, setPrice] = useState("");

  // Rent fields
  const [rentalPriceDaily, setRentalPriceDaily] = useState("");
  const [rentalPriceWeekly, setRentalPriceWeekly] = useState("");
  const [rentalPriceHourly, setRentalPriceHourly] = useState("");
  const [deposit, setDeposit] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!user) return;

    setLoading(true);
    try {
      // Get vendor id
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!vendor) { toast.error("Vendor not found"); setLoading(false); return; }

      let imageUrl: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${vendor.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const specsArray = specs
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s);

      const { error } = await supabase.from("products").insert({
        vendor_id: vendor.id,
        name: name.trim(),
        description: description.trim(),
        category,
        type: productType,
        price: productType !== "rent" ? Number(price) || 0 : null,
        rental_price_daily: productType !== "sell" ? Number(rentalPriceDaily) || null : null,
        rental_price_weekly: productType !== "sell" ? Number(rentalPriceWeekly) || null : null,
        rental_price_hourly: productType !== "sell" ? Number(rentalPriceHourly) || null : null,
        deposit: productType !== "sell" ? Number(deposit) || 0 : 0,
        stock: Number(stock) || 0,
        unit,
        image_url: imageUrl,
        specs: specsArray.length > 0 ? specsArray : null,
        in_stock: true,
        is_active: true,
      });

      if (error) throw error;
      toast.success("Product added!");
      navigate("/vendor");
    } catch (err: any) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const showSellFields = productType === "sell" || productType === "both";
  const showRentFields = productType === "rent" || productType === "both";

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/vendor" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-foreground">{t("vendor.addProduct")}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4 space-y-4">
        {/* Product Type Toggle */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-2 block">Product Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(["sell", "rent", "both"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setProductType(type)}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition-colors ${
                  productType === type
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {type === "sell" && <Package className="h-3.5 w-3.5" />}
                {type === "rent" && <Clock className="h-3.5 w-3.5" />}
                {type === "both" && <><Package className="h-3 w-3" /><Clock className="h-3 w-3" /></>}
                {type === "sell" ? "For Sale" : type === "rent" ? "For Rent" : "Both"}
              </button>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-2 block">Product Image</label>
          <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Tap to upload image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. UltraTech Cement (OPC 53)"
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the product..."
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Stock & Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {["piece", "kg", "bag", "meter", "feet", "liter", "set", "pack", "coil", "bundle", "rental"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sale Price */}
        {showSellFields && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Sale Pricing
            </h3>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Rental Pricing */}
        {showRentFields && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" /> Rental Pricing
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-foreground mb-1 block">Hourly (₹)</label>
                <input
                  type="number"
                  value={rentalPriceHourly}
                  onChange={(e) => setRentalPriceHourly(e.target.value)}
                  placeholder="—"
                  className="w-full rounded-lg border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground mb-1 block">Daily (₹)</label>
                <input
                  type="number"
                  value={rentalPriceDaily}
                  onChange={(e) => setRentalPriceDaily(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground mb-1 block">Weekly (₹)</label>
                <input
                  type="number"
                  value={rentalPriceWeekly}
                  onChange={(e) => setRentalPriceWeekly(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Refundable Deposit (₹)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Specs */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Specifications (one per line)</label>
          <textarea
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            rows={3}
            placeholder={"Brand: Bosch\nPower: 500W\nWeight: 2.5 kg"}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none font-mono text-xs"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {loading ? "Adding…" : "Add Product"}
        </button>
      </div>
    </div>
  );
};

export default VendorAddProduct;
