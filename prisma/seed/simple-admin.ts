import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createSimpleAdminSeed() {
  console.log('🌱 Starting simple admin seed...')

  try {
    // 1. Create Admin User
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
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

    // 2. Create Basic Categories
    console.log('📂 Creating categories...')
    
    let electronics = await prisma.category.findFirst({ where: { name: 'Electronics' } })
    if (!electronics) {
      electronics = await prisma.category.create({
        data: { name: 'Electronics', description: 'Electronic devices and gadgets', isActive: true }
      })
    }

    let clothing = await prisma.category.findFirst({ where: { name: 'Clothing' } })
    if (!clothing) {
      clothing = await prisma.category.create({
        data: { name: 'Clothing', description: 'Fashion and apparel', isActive: true }
      })
    }

    // 3. Create SubCategories
    console.log('📁 Creating subcategories...')
    let smartphones = await prisma.subCategory.findFirst({ where: { name: 'Smartphones' } })
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

    let menClothing = await prisma.subCategory.findFirst({ where: { name: "Men's Clothing" } })
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

    // 4. Create Brands
    console.log('🏷️ Creating brands...')
    let apple = await prisma.brand.findFirst({ where: { name: 'Apple' } })
    if (!apple) {
      apple = await prisma.brand.create({
        data: { name: 'Apple', description: 'Premium technology products', isActive: true }
      })
    }

    let nike = await prisma.brand.findFirst({ where: { name: 'Nike' } })
    if (!nike) {
      nike = await prisma.brand.create({
        data: { name: 'Nike', description: 'Athletic wear and sportswear', isActive: true }
      })
    }

    // 5. Create Unit
    console.log('📏 Creating units...')
    let piece = await prisma.unit.findFirst({ where: { name: 'Piece' } })
    if (!piece) {
      piece = await prisma.unit.create({
        data: { name: 'Piece', shortName: 'pcs', description: 'Individual items', isActive: true }
      })
    }

    // 6. Create Product Collections
    console.log('🎯 Creating product collections...')
    let featuredCollection = await prisma.productCollection.findFirst({ where: { slug: 'featured-products' } })
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

    // 7. Create Sample Products
    console.log('📱 Creating sample products...')

    // Simple product without variants
    let laptop = await prisma.product.findFirst({ where: { slug: 'macbook-pro-14' } })
    if (!laptop) {
      laptop = await prisma.product.create({
        data: {
          name: 'MacBook Pro 14"',
          shortDescription: 'Powerful laptop for professionals',
          description: 'The MacBook Pro 14" features M3 Pro chip, 18GB unified memory, and 512GB SSD storage.',
          slug: 'macbook-pro-14',
          metaTitle: 'MacBook Pro 14" - Professional Laptop | Apple',
          metaDescription: 'Discover the MacBook Pro 14" with M3 Pro chip for professional workflows.',
          status: 'ACTIVE',
          isActive: true,
          isFeatured: true,
          images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          price: 1999.99,
          comparePrice: 2199.99,
          costPrice: 1500,
          stockQuantity: 12,
          sku: 'MACBOOK-PRO-14-M3',
          weight: 1600,
          length: 31.26,
          width: 22.12,
          height: 1.55,
          requiresShipping: true,
          tags: ['laptop', 'apple', 'macbook', 'professional', 'm3'],
          hasVariants: false,
          categoryId: electronics.id,
          subCategoryId: smartphones.id, // Using smartphones subcategory for simplicity
          brandId: apple.id,
          unitId: piece.id,
          publishedAt: new Date(),
        }
      })
    }

    // Product with variants
    let tshirt = await prisma.product.findFirst({ where: { slug: 'nike-classic-tee' } })
    if (!tshirt) {
      tshirt = await prisma.product.create({
        data: {
          name: 'Nike Classic T-Shirt',
          shortDescription: 'Comfortable cotton t-shirt for everyday wear',
          description: 'The Nike Classic T-Shirt is made from 100% cotton for comfort and durability.',
          slug: 'nike-classic-tee',
          metaTitle: 'Nike Classic T-Shirt - Comfortable Cotton Tee | Nike',
          metaDescription: 'Comfortable Nike Classic T-Shirt made from 100% cotton. Available in multiple colors and sizes.',
          status: 'ACTIVE',
          isActive: true,
          isFeatured: false,
          images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          price: 24.99,
          comparePrice: 29.99,
          costPrice: 12,
          stockQuantity: 0, // Will be managed by variants
          sku: 'NIKE-CLASSIC-TEE',
          weight: 200,
          requiresShipping: true,
          tags: ['t-shirt', 'nike', 'cotton', 'casual', 'classic'],
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

      // Create variants for t-shirt
      const variants = [
        { color: 'Black', size: 'S', stock: 15, isDefault: true },
        { color: 'Black', size: 'M', stock: 20, isDefault: false },
        { color: 'Black', size: 'L', stock: 18, isDefault: false },
        { color: 'White', size: 'M', stock: 25, isDefault: false },
        { color: 'White', size: 'L', stock: 22, isDefault: false },
        { color: 'Navy', size: 'M', stock: 12, isDefault: false },
      ]

      for (const variant of variants) {
        await prisma.productVariant.create({
          data: {
            productId: tshirt.id,
            option1Value: variant.color,
            option2Value: variant.size,
            sku: `NIKE-TEE-${variant.color.toUpperCase()}-${variant.size}`,
            price: 24.99,
            comparePrice: 29.99,
            costPrice: 12,
            stockQuantity: variant.stock,
            weight: 200,
            isDefault: variant.isDefault,
            isActive: true,
          }
        })
      }
    }

    // 8. Add products to collections
    console.log('🎯 Adding products to collections...')
    const existingCollectionItems = await prisma.productOnCollection.findMany({
      where: { collectionId: featuredCollection.id }
    })

    if (existingCollectionItems.length === 0) {
      await prisma.productOnCollection.createMany({
        data: [
          { productId: laptop.id, collectionId: featuredCollection.id, position: 1 },
          { productId: tshirt.id, collectionId: featuredCollection.id, position: 2 },
        ],
        skipDuplicates: true,
      })
    }

    // 9. Create sample reviews
    console.log('⭐ Creating product reviews...')
    const existingReviews = await prisma.productReview.findMany()
    if (existingReviews.length === 0) {
      await prisma.productReview.createMany({
        data: [
          {
            productId: laptop.id,
            userId: admin.id,
            rating: 5,
            content: 'Excellent laptop! Great performance and build quality.',
            isActive: true,
          },
          {
            productId: tshirt.id,
            userId: admin.id,
            rating: 4,
            content: 'Comfortable t-shirt, good quality cotton.',
            isActive: true,
          },
        ],
        skipDuplicates: true,
      })
    }

    console.log('✅ Simple admin seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log('👤 Admin user: admin@ecommerce.com (password: admin123)')
    console.log('📂 Categories: 2 (Electronics, Clothing)')
    console.log('📁 Subcategories: 2')
    console.log('🏷️ Brands: 2 (Apple, Nike)')
    console.log('📏 Units: 1 (Piece)')
    console.log('🎯 Collections: 1 (Featured Products)')
    console.log('📱 Products: 2 (1 simple, 1 with variants)')
    console.log('🎨 Product variants: 6 for t-shirt')
    console.log('⭐ Reviews: 2')

  } catch (error) {
    console.error('❌ Error creating simple admin seed:', error)
    throw error
  }
}

async function main() {
  await createSimpleAdminSeed()
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
