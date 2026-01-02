import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createAdminSeed() {
  console.log('🌱 Starting admin seed...')

  try {
    // 1. Create Admin User
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Check if admin already exists
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@ecommerce.com' }
    })
    
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@ecommerce.com',
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        }
      })
      console.log('✅ Admin user created:', admin.email)
    } else {
      console.log('✅ Admin user already exists:', admin.email)
    }

    // 2. Create Categories
    console.log('📂 Creating categories...')
    let electronics = await prisma.category.findFirst({
      where: { name: 'Electronics' }
    })
    if (!electronics) {
      electronics = await prisma.category.create({
        data: {
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          isActive: true,
        }
      })
    }

    let clothing = await prisma.category.findFirst({
      where: { name: 'Clothing' }
    })
    if (!clothing) {
      clothing = await prisma.category.create({
        data: {
          name: 'Clothing',
          description: 'Fashion and apparel',
          isActive: true,
        }
      })
    }

    let homeGarden = await prisma.category.findFirst({
      where: { name: 'Home & Garden' }
    })
    if (!homeGarden) {
      homeGarden = await prisma.category.create({
        data: {
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          isActive: true,
        }
      })
    }

    // 3. Create SubCategories
    console.log('📁 Creating subcategories...')
    let smartphones = await prisma.subCategory.findFirst({
      where: { name: 'Smartphones' }
    })
    if (!smartphones) {
      smartphones = await prisma.subCategory.create({
        data: {
          name: 'Smartphones',
          description: 'Mobile phones and accessories',
          categoryId: electronics.id,
          isActive: true,
        }
      })
    }

    let laptops = await prisma.subCategory.findFirst({
      where: { name: 'Laptops' }
    })
    if (!laptops) {
      laptops = await prisma.subCategory.create({
        data: {
          name: 'Laptops',
          description: 'Portable computers',
          categoryId: electronics.id,
          isActive: true,
        }
      })
    }

    let menClothing = await prisma.subCategory.findFirst({
      where: { name: "Men's Clothing" }
    })
    if (!menClothing) {
      menClothing = await prisma.subCategory.create({
        data: {
          name: "Men's Clothing",
          description: 'Clothing for men',
          categoryId: clothing.id,
          isActive: true,
        }
      })
    }

    let womenClothing = await prisma.subCategory.findFirst({
      where: { name: "Women's Clothing" }
    })
    if (!womenClothing) {
      womenClothing = await prisma.subCategory.create({
        data: {
          name: "Women's Clothing",
          description: 'Clothing for women',
          categoryId: clothing.id,
          isActive: true,
        }
      })
    }

    // 4. Create Brands
    console.log('🏷️ Creating brands...')
    let apple = await prisma.brand.findFirst({
      where: { name: 'Apple' }
    })
    if (!apple) {
      apple = await prisma.brand.create({
        data: {
          name: 'Apple',
          description: 'Premium technology products',
          isActive: true,
        }
      })
    }

    let samsung = await prisma.brand.findFirst({
      where: { name: 'Samsung' }
    })
    if (!samsung) {
      samsung = await prisma.brand.create({
        data: {
          name: 'Samsung',
          description: 'Innovative electronics',
          isActive: true,
        }
      })
    }

    let nike = await prisma.brand.findFirst({
      where: { name: 'Nike' }
    })
    if (!nike) {
      nike = await prisma.brand.create({
        data: {
          name: 'Nike',
          description: 'Athletic wear and sportswear',
          isActive: true,
        }
      })
    }

    let adidas = await prisma.brand.findFirst({
      where: { name: 'Adidas' }
    })
    if (!adidas) {
      adidas = await prisma.brand.create({
        data: {
          name: 'Adidas',
          description: 'Sports and lifestyle brand',
          isActive: true,
        }
      })
    }

    // 5. Create Units
    console.log('📏 Creating units...')
    let piece = await prisma.unit.findFirst({
      where: { name: 'Piece' }
    })
    if (!piece) {
      piece = await prisma.unit.create({
        data: {
          name: 'Piece',
          shortName: 'pcs',
          description: 'Individual items',
          isActive: true,
        }
      })
    }

    let kilogram = await prisma.unit.findFirst({
      where: { name: 'Kilogram' }
    })
    if (!kilogram) {
      kilogram = await prisma.unit.create({
        data: {
          name: 'Kilogram',
          shortName: 'kg',
          description: 'Weight in kilograms',
          isActive: true,
        }
      })
    }

    // 6. Create Product Collections
    console.log('🎯 Creating product collections...')
    let featuredCollection = await prisma.productCollection.findFirst({
      where: { slug: 'featured-products' }
    })
    if (!featuredCollection) {
      featuredCollection = await prisma.productCollection.create({
        data: {
          name: 'Featured Products',
          description: 'Our most popular and recommended items',
          slug: 'featured-products',
          isActive: true,
          sortOrder: 1,
        }
      })
    }

    let newArrivals = await prisma.productCollection.findFirst({
      where: { slug: 'new-arrivals' }
    })
    if (!newArrivals) {
      newArrivals = await prisma.productCollection.create({
        data: {
          name: 'New Arrivals',
          description: 'Latest products in our store',
          slug: 'new-arrivals',
          isActive: true,
          sortOrder: 2,
        }
      })
    }

    let saleCollection = await prisma.productCollection.findFirst({
      where: { slug: 'sale-items' }
    })
    if (!saleCollection) {
      saleCollection = await prisma.productCollection.create({
        data: {
          name: 'Sale Items',
          description: 'Discounted products',
          slug: 'sale-items',
          isActive: true,
          sortOrder: 3,
        }
      })
    }

    // 7. Create Sample Products
    console.log('📱 Creating sample products...')

    // iPhone with variants
    let iphone = await prisma.product.findFirst({
      where: { slug: 'iphone-15-pro' }
    })
    if (!iphone) {
      iphone = await prisma.product.create({
        data: {
        name: 'iPhone 15 Pro',
        shortDescription: 'The most powerful iPhone ever with titanium design',
        description: 'The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system with 3x telephoto zoom.',
        slug: 'iphone-15-pro',
        metaTitle: 'iPhone 15 Pro - Premium Smartphone | Apple',
        metaDescription: 'Discover the iPhone 15 Pro with titanium design, A17 Pro chip, and pro camera system. Available in multiple colors and storage options.',
        status: 'ACTIVE',
        isActive: true,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400'
        ],
        thumbnailUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        price: 999,
        comparePrice: 1099,
        costPrice: 750,
        stockQuantity: 0, // Will be managed by variants
        sku: 'IPHONE15PRO',
        barcode: '194253000000',
        weight: 187,
        length: 14.67,
        width: 7.09,
        height: 0.83,
        requiresShipping: true,
        tags: ['smartphone', 'apple', 'premium', 'titanium', 'pro'],
        hasVariants: true,
        option1Name: 'Color',
        option2Name: 'Storage',
        categoryId: electronics.id,
        subCategoryId: smartphones.id,
        brandId: apple.id,
        unitId: piece.id,
        publishedAt: new Date(),
        }
      })
    }

    // iPhone variants
    const iphoneVariants = [
      { color: 'Natural Titanium', storage: '128GB', price: 999, stock: 15 },
      { color: 'Natural Titanium', storage: '256GB', price: 1099, stock: 12 },
      { color: 'Natural Titanium', storage: '512GB', price: 1299, stock: 8 },
      { color: 'Blue Titanium', storage: '128GB', price: 999, stock: 10 },
      { color: 'Blue Titanium', storage: '256GB', price: 1099, stock: 7 },
      { color: 'White Titanium', storage: '128GB', price: 999, stock: 13 },
      { color: 'White Titanium', storage: '256GB', price: 1099, stock: 9 },
      { color: 'Black Titanium', storage: '128GB', price: 999, stock: 11 },
      { color: 'Black Titanium', storage: '256GB', price: 1099, stock: 6 },
      { color: 'Black Titanium', storage: '512GB', price: 1299, stock: 4 },
    ]

    for (let i = 0; i < iphoneVariants.length; i++) {
      const variant = iphoneVariants[i]
      await prisma.productVariant.create({
        data: {
          productId: iphone.id,
          option1Value: variant.color,
          option2Value: variant.storage,
          sku: `IPHONE15PRO-${variant.color.replace(/\s+/g, '').toUpperCase()}-${variant.storage}`,
          price: variant.price,
          comparePrice: variant.price + 100,
          costPrice: variant.price * 0.75,
          stockQuantity: variant.stock,
          weight: 187,
          isDefault: i === 0,
          isActive: true,
        }
      })
    }

    // Nike T-Shirt with variants
    const nikeShirt = await prisma.product.upsert({
      where: { slug: 'nike-dri-fit-tshirt' },
      update: {},
      create: {
        name: 'Nike Dri-FIT T-Shirt',
        shortDescription: 'Comfortable athletic t-shirt with moisture-wicking technology',
        description: 'The Nike Dri-FIT T-Shirt features sweat-wicking fabric to help keep you dry and comfortable during workouts.',
        slug: 'nike-dri-fit-tshirt',
        metaTitle: 'Nike Dri-FIT T-Shirt - Athletic Wear | Nike',
        metaDescription: 'Stay dry and comfortable with Nike Dri-FIT T-Shirt. Available in multiple colors and sizes.',
        status: 'ACTIVE',
        isActive: true,
        isFeatured: false,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'
        ],
        thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        price: 29.99,
        comparePrice: 39.99,
        costPrice: 15,
        stockQuantity: 0, // Will be managed by variants
        sku: 'NIKE-DRIFIT-TEE',
        weight: 150,
        requiresShipping: true,
        tags: ['t-shirt', 'athletic', 'nike', 'dri-fit', 'workout'],
        hasVariants: true,
        option1Name: 'Color',
        option2Name: 'Size',
        categoryId: clothing.id,
        subCategoryId: menClothing.id,
        brandId: nike.id,
        unitId: piece.id,
        publishedAt: new Date(),
      }
    })

    // Nike T-Shirt variants
    const shirtVariants = [
      { color: 'Black', size: 'S', stock: 25 },
      { color: 'Black', size: 'M', stock: 30 },
      { color: 'Black', size: 'L', stock: 20 },
      { color: 'Black', size: 'XL', stock: 15 },
      { color: 'White', size: 'S', stock: 20 },
      { color: 'White', size: 'M', stock: 25 },
      { color: 'White', size: 'L', stock: 18 },
      { color: 'Navy', size: 'M', stock: 22 },
      { color: 'Navy', size: 'L', stock: 16 },
      { color: 'Red', size: 'M', stock: 12 },
    ]

    for (let i = 0; i < shirtVariants.length; i++) {
      const variant = shirtVariants[i]
      await prisma.productVariant.create({
        data: {
          productId: nikeShirt.id,
          option1Value: variant.color,
          option2Value: variant.size,
          sku: `NIKE-TEE-${variant.color.toUpperCase()}-${variant.size}`,
          price: 29.99,
          comparePrice: 39.99,
          costPrice: 15,
          stockQuantity: variant.stock,
          weight: 150,
          isDefault: i === 0,
          isActive: true,
        }
      })
    }

    // Samsung Laptop (simple product without variants)
    const laptop = await prisma.product.upsert({
      where: { slug: 'samsung-galaxy-book3' },
      update: {},
      create: {
        name: 'Samsung Galaxy Book3',
        shortDescription: 'Powerful laptop for productivity and creativity',
        description: 'The Samsung Galaxy Book3 features Intel Core i7 processor, 16GB RAM, and 512GB SSD for exceptional performance.',
        slug: 'samsung-galaxy-book3',
        metaTitle: 'Samsung Galaxy Book3 Laptop - High Performance | Samsung',
        metaDescription: 'Discover the Samsung Galaxy Book3 with Intel Core i7, 16GB RAM, and 512GB SSD. Perfect for work and creativity.',
        status: 'ACTIVE',
        isActive: true,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'
        ],
        thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        price: 1299.99,
        comparePrice: 1499.99,
        costPrice: 950,
        stockQuantity: 8,
        sku: 'SAMSUNG-BOOK3-I7',
        barcode: '887276798765',
        weight: 1580,
        length: 35.5,
        width: 22.9,
        height: 1.69,
        requiresShipping: true,
        tags: ['laptop', 'samsung', 'intel', 'productivity', 'business'],
        hasVariants: false,
        categoryId: electronics.id,
        subCategoryId: laptops.id,
        brandId: samsung.id,
        unitId: piece.id,
        publishedAt: new Date(),
      }
    })

    // Draft Product (for testing)
    const draftProduct = await prisma.product.upsert({
      where: { slug: 'adidas-running-shoes-draft' },
      update: {},
      create: {
        name: 'Adidas UltraBoost Running Shoes',
        shortDescription: 'Premium running shoes with boost technology',
        description: 'Experience ultimate comfort and energy return with Adidas UltraBoost running shoes.',
        slug: 'adidas-running-shoes-draft',
        status: 'DRAFT',
        isActive: false,
        isFeatured: false,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
        ],
        thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        price: 179.99,
        comparePrice: 199.99,
        costPrice: 90,
        stockQuantity: 0,
        sku: 'ADIDAS-ULTRABOOST',
        tags: ['shoes', 'running', 'adidas', 'boost', 'athletic'],
        hasVariants: false,
        categoryId: clothing.id,
        brandId: adidas.id,
        unitId: piece.id,
      }
    })

    // 8. Add products to collections
    console.log('🎯 Adding products to collections...')
    await prisma.productOnCollection.createMany({
      data: [
        { productId: iphone.id, collectionId: featuredCollection.id, position: 1 },
        { productId: laptop.id, collectionId: featuredCollection.id, position: 2 },
        { productId: nikeShirt.id, collectionId: newArrivals.id, position: 1 },
        { productId: iphone.id, collectionId: saleCollection.id, position: 1 },
        { productId: nikeShirt.id, collectionId: saleCollection.id, position: 2 },
      ],
      skipDuplicates: true,
    })

    // 9. Create some reviews for products
    console.log('⭐ Creating product reviews...')
    await prisma.productReview.createMany({
      data: [
        {
          productId: iphone.id,
          userId: admin.id,
          rating: 5,
          content: 'Amazing phone! The camera quality is incredible and the titanium build feels premium.',
          isActive: true,
        },
        {
          productId: laptop.id,
          userId: admin.id,
          rating: 4,
          content: 'Great laptop for work. Fast performance and good battery life.',
          isActive: true,
        },
        {
          productId: nikeShirt.id,
          userId: admin.id,
          rating: 5,
          content: 'Perfect for workouts! The Dri-FIT technology really keeps you dry.',
          isActive: true,
        },
      ],
      skipDuplicates: true,
    })

    console.log('✅ Admin seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log('👤 Admin user: admin@ecommerce.com (password: admin123)')
    console.log('📂 Categories: 3 (Electronics, Clothing, Home & Garden)')
    console.log('📁 Subcategories: 4')
    console.log('🏷️ Brands: 4 (Apple, Samsung, Nike, Adidas)')
    console.log('📏 Units: 2')
    console.log('🎯 Collections: 3')
    console.log('📱 Products: 4 (2 with variants, 2 simple, 1 draft)')
    console.log('🎨 Product variants: 20 total')
    console.log('⭐ Reviews: 3')

  } catch (error) {
    console.error('❌ Error creating admin seed:', error)
    throw error
  }
}

async function main() {
  await createAdminSeed()
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
