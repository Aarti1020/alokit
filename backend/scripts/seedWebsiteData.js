import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";
import Category from "../src/models/Category.js";
import SubCategory from "../src/models/SubCategory.js";
import Product from "../src/models/Product.js";
import Collection from "../src/models/Collection.js";
import Banner from "../src/models/Banner.js";
import Blog from "../src/models/Blog.js";
import Page from "../src/models/Page.js";
import FAQ from "../src/models/FAQ.js";
import SEOConfig from "../src/models/SEOConfig.js";
import HomepageSection from "../src/models/HomepageSection.js";
import Review from "../src/models/Review.js";

const image = (path) => `https://images.alokit.local/${path}`;
const productImage = (fileName) => `/assets/products/${fileName}`;

const upsertBy = async (Model, filter, update, options = {}) => {
  const existing = await Model.findOne(filter);

  if (existing) {
    Object.assign(existing, update);
    await existing.save();
    return existing;
  }

  return Model.create({ ...filter, ...update, ...options.defaults });
};

const seedAdmin = async () => {
  const fullName = process.env.SUPERADMIN_NAME || "Alokit Super Admin";
  const email = (process.env.SUPERADMIN_EMAIL || "superadmin@alokit.co").toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD || "Admin@123456";
  const phone = process.env.SUPERADMIN_PHONE || "9999999999";

  const admin = await User.findOne({ email }).select("+password");

  if (admin) {
    admin.fullName = fullName;
    admin.password = password;
    admin.phone = phone;
    admin.role = "superAdmin";
    admin.isActive = true;
    await admin.save();
    return admin;
  }

  return User.create({
    fullName,
    email,
    password,
    phone,
    role: "superAdmin",
    isActive: true
  });
};

const seedCategories = async () => {
  const gemstones = await upsertBy(
    Category,
    { slug: "gemstones" },
    {
      name: "Gemstones",
      description: "Certified astrological gemstones for guidance, growth, and balance.",
      image: image("categories/gemstones.jpg"),
      isActive: true
    }
  );

  const rudraksha = await upsertBy(
    Category,
    { slug: "rudraksha" },
    {
      name: "Rudraksha",
      description: "Authentic rudraksha beads for spiritual practice and daily wellness.",
      image: image("categories/rudraksha.jpg"),
      isActive: true
    }
  );

  const bracelets = await upsertBy(
    Category,
    { slug: "bracelets" },
    {
      name: "Bracelets",
      description: "Purpose-driven bracelets crafted for protection, harmony, and intention.",
      image: image("categories/bracelets.jpg"),
      isActive: true
    }
  );

  return { gemstones, rudraksha, bracelets };
};

const seedSubCategories = async (categories) => {
  const blueSapphire = await upsertBy(
    SubCategory,
    { slug: "blue-sapphire", category: categories.gemstones._id },
    {
      name: "Blue Sapphire",
      description: "Premium Neelam stones for Saturn remedies and focus.",
      isActive: true
    }
  );

  const yellowSapphire = await upsertBy(
    SubCategory,
    { slug: "yellow-sapphire", category: categories.gemstones._id },
    {
      name: "Yellow Sapphire",
      description: "Pukhraj stones selected for Jupiter-related prosperity and wisdom.",
      isActive: true
    }
  );

  const fiveMukhi = await upsertBy(
    SubCategory,
    { slug: "5-mukhi-rudraksha", category: categories.rudraksha._id },
    {
      name: "5 Mukhi Rudraksha",
      description: "Daily-wear rudraksha for calmness, discipline, and spiritual grounding.",
      isActive: true
    }
  );

  const healingBracelets = await upsertBy(
    SubCategory,
    { slug: "healing-bracelets", category: categories.bracelets._id },
    {
      name: "Healing Bracelets",
      description: "Bracelets built around crystal energies and mindful intention.",
      isActive: true
    }
  );

  return { blueSapphire, yellowSapphire, fiveMukhi, healingBracelets };
};

const seedProducts = async (admin, categories, subCategories) => {
  const products = [
    {
      slug: "certified-blue-sapphire-7-25-carat",
      name: "Certified Blue Sapphire 7.25 Carat",
      title: "Certified Blue Sapphire 7.25 Carat",
      sku: "ALO-GEM-BS-725",
      category: categories.gemstones._id,
      subCategory: subCategories.blueSapphire._id,
      productType: "gemstone",
      shortDescription: "A premium natural blue sapphire chosen for strong Saturn support and clarity.",
      description:
        "<p>This certified blue sapphire is curated for astrological use, with a rich tone, clean finish, and wearable setting guidance.</p>",
      featuredImage: productImage("blue-sapphire-main.webp"),
      thumbnail: productImage("blue-sapphire-side.jpg"),
      galleryImages: [
        productImage("blue-sapphire-main.webp"),
        productImage("blue-sapphire-side.jpg")
      ],
      images: [
        productImage("blue-sapphire-main.webp"),
        productImage("blue-sapphire-side.jpg")
      ],
      basePrice: 45000,
      salePrice: 39999,
      stock: 4,
      status: "published",
      isFeatured: true,
      showOnHomepage: true,
      tags: ["saturn", "neelam", "certified"],
      origin: "Sri Lanka",
      shape: "Oval",
      style: "Loose Stone",
      weightCarat: 7.25,
      weightRatti: 8.0,
      certificationLab: "IGI",
      treatment: "Unheated",
      specifications: {
        color: "Royal blue",
        transparency: "Transparent",
        recommendation: "Saturn"
      },
      seoTitle: "Certified Blue Sapphire 7.25 Carat | Alokit",
      seoDescription: "Premium certified blue sapphire for astrological consultation and wear.",
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      slug: "yellow-sapphire-5-10-carat",
      name: "Yellow Sapphire 5.10 Carat",
      title: "Yellow Sapphire 5.10 Carat",
      sku: "ALO-GEM-YS-510",
      category: categories.gemstones._id,
      subCategory: subCategories.yellowSapphire._id,
      productType: "gemstone",
      shortDescription: "Bright certified pukhraj for prosperity, wisdom, and Jupiter remedies.",
      description:
        "<p>A wearable yellow sapphire selected for quality, color consistency, and practical astrology-focused guidance.</p>",
      featuredImage: productImage("yellow-sapphire-main.jpg"),
      thumbnail: productImage("yellow-sapphire-thumb.jpg"),
      galleryImages: [productImage("yellow-sapphire-main.jpg")],
      images: [productImage("yellow-sapphire-main.jpg")],
      basePrice: 32000,
      salePrice: 28999,
      stock: 6,
      status: "published",
      isFeatured: true,
      showOnHomepage: true,
      tags: ["jupiter", "pukhraj", "wealth"],
      origin: "Ceylon",
      shape: "Cushion",
      style: "Loose Stone",
      weightCarat: 5.1,
      weightRatti: 5.6,
      certificationLab: "GII",
      treatment: "None",
      specifications: {
        color: "Golden yellow",
        transparency: "Transparent",
        recommendation: "Jupiter"
      },
      seoTitle: "Yellow Sapphire 5.10 Carat | Alokit",
      seoDescription: "Certified yellow sapphire for Jupiter alignment and prosperity.",
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      slug: "5-mukhi-rudraksha-mala",
      name: "5 Mukhi Rudraksha Mala",
      title: "5 Mukhi Rudraksha Mala",
      sku: "ALO-RUD-5M-108",
      category: categories.rudraksha._id,
      subCategory: subCategories.fiveMukhi._id,
      productType: "rudraksha",
      shortDescription: "A 108-bead 5 mukhi mala for grounding, meditation, and daily spiritual wear.",
      description:
        "<p>This mala is designed for everyday spiritual use, offering a classic and approachable entry point into rudraksha practice.</p>",
      featuredImage: productImage("five-mukhi-rudraksha.jpg"),
      thumbnail: productImage("five-mukhi-rudraksha-thumb.webp"),
      galleryImages: [productImage("five-mukhi-rudraksha.jpg")],
      images: [productImage("five-mukhi-rudraksha.jpg")],
      basePrice: 3500,
      salePrice: 2999,
      stock: 25,
      status: "published",
      isFeatured: true,
      showOnHomepage: true,
      tags: ["rudraksha", "meditation", "spiritual"],
      origin: "Nepal",
      shape: "Round",
      style: "Mala",
      certificationLab: "In-house Verification",
      treatment: "Natural",
      specifications: {
        beads: 108,
        mukhi: 5,
        purpose: "Meditation and daily wear"
      },
      seoTitle: "5 Mukhi Rudraksha Mala | Alokit",
      seoDescription: "Authentic 5 mukhi rudraksha mala for meditation and balance.",
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      slug: "black-obsidian-protection-bracelet",
      name: "Black Obsidian Protection Bracelet",
      title: "Black Obsidian Protection Bracelet",
      sku: "ALO-BRC-OBS-001",
      category: categories.bracelets._id,
      subCategory: subCategories.healingBracelets._id,
      productType: "bracelet",
      shortDescription: "A protection-focused bracelet designed for grounding and energy shielding.",
      description:
        "<p>Made for modern everyday wear, this bracelet blends intention-led design with a versatile finish.</p>",
      featuredImage: productImage("obsidian-bracelet.jpg"),
      thumbnail: productImage("obsidian-bracelet-thumb.jpg"),
      galleryImages: [productImage("obsidian-bracelet.jpg")],
      images: [productImage("obsidian-bracelet.jpg")],
      basePrice: 1800,
      salePrice: 1499,
      stock: 18,
      status: "published",
      isFeatured: false,
      showOnHomepage: true,
      tags: ["protection", "bracelet", "obsidian"],
      style: "Stretch Bracelet",
      specifications: {
        beadSize: "8mm",
        wristFit: "Standard",
        purpose: "Protection and grounding"
      },
      seoTitle: "Black Obsidian Protection Bracelet | Alokit",
      seoDescription: "Daily-wear protection bracelet for grounding and emotional steadiness.",
      createdBy: admin._id,
      updatedBy: admin._id
    }
  ];

  const savedProducts = [];
  for (const productData of products) {
    const product = await upsertBy(Product, { slug: productData.slug }, productData);
    savedProducts.push(product);
  }

  return savedProducts;
};

const seedCollections = async (admin, products) => {
  const productIds = products.map((product) => product._id);

  const collection = await upsertBy(
    Collection,
    { slug: "astrology-essentials" },
    {
      title: "Astrology Essentials",
      shortDescription: "A curated set of bestselling remedies for protection, growth, and spiritual focus.",
      description:
        "<p>Explore a balanced mix of gemstones, rudraksha, and bracelets handpicked for practical spiritual use.</p>",
      heroImage: image("collections/astrology-essentials-hero.jpg"),
      thumbnail: image("collections/astrology-essentials-thumb.jpg"),
      productIds,
      productType: "",
      about: "<p>This collection introduces trusted remedies suitable for beginners and repeat buyers alike.</p>",
      whoShouldWear: "<p>Ideal for seekers looking for guided spiritual support and wearable solutions.</p>",
      benefits: "<p>Protection, clarity, confidence, calmness, and a more intentional daily ritual.</p>",
      qualityAndPrice: "<p>Each product is chosen to balance authenticity, presentation, and value.</p>",
      faqs: [
        {
          question: "Who is this collection for?",
          answer: "<p>Anyone exploring remedies for confidence, protection, and spiritual alignment.</p>"
        }
      ],
      filtersConfig: {
        sort: ["latest", "price_asc", "price_desc"],
        productType: ["gemstone", "rudraksha", "bracelet"]
      },
      sortOrder: 1,
      showOnHomepage: true,
      isFeatured: true,
      status: "published",
      seo: {
        metaTitle: "Astrology Essentials Collection | Alokit",
        metaDescription: "Featured gemstones, rudraksha, and bracelets for practical spiritual support.",
        metaKeywords: ["astrology remedies", "gemstones", "rudraksha"],
        ogTitle: "Astrology Essentials",
        ogDescription: "A curated remedy collection from Alokit.",
        ogImage: image("collections/astrology-essentials-hero.jpg"),
        canonicalUrl: "/collections/astrology-essentials",
        robots: "index,follow"
      },
      createdBy: admin._id,
      updatedBy: admin._id
    }
  );

  await Product.updateMany(
    { _id: { $in: productIds } },
    { $addToSet: { collections: collection._id } }
  );

  return collection;
};

const seedContent = async (admin, collection, products) => {
  await upsertBy(
    Banner,
    { slug: "homepage-main-hero" },
    {
      title: "Homepage Main Hero",
      type: "hero",
      image: image("banners/home-hero-desktop.jpg"),
      mobileImage: image("banners/home-hero-mobile.jpg"),
      link: "/collections/astrology-essentials",
      buttonText: "Shop Essentials",
      page: "homepage",
      position: "top",
      status: "active",
      sortOrder: 1,
      isClickable: true,
      targetType: "collection",
      targetValue: collection.slug,
      createdBy: admin._id,
      updatedBy: admin._id
    }
  );

  await upsertBy(
    Banner,
    { slug: "homepage-promo-rudraksha" },
    {
      title: "Homepage Promo Rudraksha",
      type: "promo",
      image: image("banners/rudraksha-promo.jpg"),
      mobileImage: image("banners/rudraksha-promo-mobile.jpg"),
      link: "/products/5-mukhi-rudraksha-mala",
      buttonText: "View Product",
      page: "homepage",
      position: "mid",
      status: "active",
      sortOrder: 2,
      isClickable: true,
      targetType: "product",
      targetValue: "5-mukhi-rudraksha-mala",
      createdBy: admin._id,
      updatedBy: admin._id
    }
  );

  const blogs = [
    {
      slug: "how-to-choose-your-first-gemstone",
      title: "How to Choose Your First Gemstone",
      excerpt: "A practical guide for first-time buyers looking at certified gemstones.",
      content:
        "<p>Start with your purpose, then understand authenticity, budget, certification, and wearability before buying.</p>",
      featuredImage: image("blogs/first-gemstone.jpg"),
      images: [image("blogs/first-gemstone.jpg")],
      tags: ["gemstone", "buying guide"],
      category: "Gemstone Guide",
      authorName: "Alokit Team",
      status: "published",
      isFeatured: true,
      seo: {
        metaTitle: "How to Choose Your First Gemstone | Alokit",
        metaDescription: "A beginner-friendly gemstone buying guide from Alokit."
      },
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      slug: "benefits-of-5-mukhi-rudraksha",
      title: "Benefits of 5 Mukhi Rudraksha",
      excerpt: "Why 5 mukhi rudraksha remains one of the most popular spiritual wear options.",
      content:
        "<p>Known for calmness and discipline, 5 mukhi rudraksha is approachable, versatile, and suitable for daily practice.</p>",
      featuredImage: image("blogs/5-mukhi-benefits.jpg"),
      images: [image("blogs/5-mukhi-benefits.jpg")],
      tags: ["rudraksha", "spiritual"],
      category: "Rudraksha",
      authorName: "Alokit Team",
      status: "published",
      isFeatured: true,
      seo: {
        metaTitle: "Benefits of 5 Mukhi Rudraksha | Alokit",
        metaDescription: "Understand the practical benefits of 5 mukhi rudraksha."
      },
      createdBy: admin._id,
      updatedBy: admin._id
    }
  ];

  for (const blogData of blogs) {
    await upsertBy(Blog, { slug: blogData.slug }, blogData);
  }

  const pages = [
    {
      slug: "about-us",
      title: "About Us",
      pageType: "about",
      content:
        "<p>Alokit helps customers discover remedies and spiritual products through trust, clarity, and guided selection.</p>",
      status: "published",
      showInHeader: true,
      showInFooter: true,
      seo: {
        metaTitle: "About Alokit",
        metaDescription: "Learn about Alokit and our approach to spiritual commerce."
      },
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      slug: "contact-us",
      title: "Contact Us",
      pageType: "contact",
      content:
        "<p>Reach out for order support, guidance, or product recommendations through the contact form.</p>",
      status: "published",
      showInHeader: true,
      showInFooter: true,
      seo: {
        metaTitle: "Contact Alokit",
        metaDescription: "Contact the Alokit support and guidance team."
      },
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      pageType: "privacy-policy",
      content: "<p>This page explains how Alokit handles data privacy and communication preferences.</p>",
      status: "published",
      showInFooter: true,
      seo: {
        metaTitle: "Privacy Policy | Alokit",
        metaDescription: "Read the Alokit privacy policy."
      },
      createdBy: admin._id,
      updatedBy: admin._id
    }
  ];

  for (const pageData of pages) {
    await upsertBy(Page, { slug: pageData.slug }, pageData);
  }

  const faqs = [
    {
      question: "How do I choose the right product?",
      answer:
        "<p>Start with your goal, then review product details, recommendations, and support channels before purchasing.</p>",
      category: "Buying Guide",
      module: "homepage",
      status: "active",
      sortOrder: 1,
      isFeatured: true,
      createdBy: admin._id,
      updatedBy: admin._id
    },
    {
      question: "Are the gemstones certified?",
      answer:
        "<p>Yes, certified stones include lab details and are curated for clarity, suitability, and wearability.</p>",
      category: "Gemstones",
      module: "gemstone",
      status: "active",
      sortOrder: 2,
      isFeatured: true,
      createdBy: admin._id,
      updatedBy: admin._id
    }
  ];

  for (const faqData of faqs) {
    await upsertBy(FAQ, { question: faqData.question }, faqData);
  }

  await upsertBy(
    SEOConfig,
    { pageKey: "homepage" },
    {
      metaTitle: "Alokit | Gemstones, Rudraksha, Bracelets and Spiritual Guidance",
      metaDescription:
        "Discover featured gemstones, rudraksha, bracelets, collections, and guided spiritual products at Alokit.",
      metaKeywords: ["alokit", "gemstones", "rudraksha", "bracelets", "spiritual products"],
      ogTitle: "Alokit Homepage",
      ogDescription: "Featured spiritual products and collections from Alokit.",
      ogImage: image("seo/homepage-og.jpg"),
      canonicalUrl: "/",
      robots: "index,follow"
    }
  );

  const homepageSections = [
    {
      key: "hero-primary",
      title: "Hero Primary",
      sectionType: "hero",
      data: {
        eyebrow: "Trusted spiritual shopping",
        heading: "Certified remedies for modern seekers",
        subheading: "Explore gemstones, rudraksha, and bracelets curated with clarity and care.",
        primaryCta: {
          label: "Shop Now",
          href: "/collections/astrology-essentials"
        }
      },
      status: "active",
      sortOrder: 1
    },
    {
      key: "collection-grid-main",
      title: "Collection Grid Main",
      sectionType: "collection_grid",
      data: {
        heading: "Start with a curated collection",
        collectionSlugs: [collection.slug]
      },
      status: "active",
      sortOrder: 2
    },
    {
      key: "newsletter-cta",
      title: "Newsletter CTA",
      sectionType: "newsletter",
      data: {
        heading: "Get updates and buying guides",
        description: "Receive product drops, practical tips, and featured recommendations."
      },
      status: "active",
      sortOrder: 3
    }
  ];

  for (const sectionData of homepageSections) {
    await upsertBy(HomepageSection, { key: sectionData.key }, sectionData);
  }

  const featuredProduct = products[0];
  await upsertBy(
    Review,
    { product: featuredProduct._id, email: "customer1@example.com" },
    {
      name: "Priya Sharma",
      rating: 5,
      title: "Exactly what I was hoping for",
      comment: "The guidance was clear and the product quality felt premium from packaging to finish.",
      status: "approved",
      isFeatured: true,
      approvedBy: admin._id,
      approvedAt: new Date()
    }
  );
};

const run = async () => {
  try {
    await connectDB();

    const admin = await seedAdmin();
    const categories = await seedCategories();
    const subCategories = await seedSubCategories(categories);
    const products = await seedProducts(admin, categories, subCategories);
    const collection = await seedCollections(admin, products);
    await seedContent(admin, collection, products);

    const summary = {
      adminEmail: admin.email,
      categories: await Category.countDocuments(),
      subCategories: await SubCategory.countDocuments(),
      products: await Product.countDocuments(),
      collections: await Collection.countDocuments(),
      banners: await Banner.countDocuments(),
      blogs: await Blog.countDocuments(),
      pages: await Page.countDocuments(),
      faqs: await FAQ.countDocuments(),
      homepageSections: await HomepageSection.countDocuments(),
      seoConfigs: await SEOConfig.countDocuments(),
      reviews: await Review.countDocuments()
    };

    console.log("Website seed completed successfully.");
    console.log(JSON.stringify(summary, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Website seed failed:", error.message);
    process.exit(1);
  }
};

run();
