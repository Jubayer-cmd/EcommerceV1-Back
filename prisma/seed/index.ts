import { PrismaClient } from '@prisma/client'

// Import all seed scripts
import './admin'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Check if database is empty
    const userCount = await prisma.user.count()
    const productCount = await prisma.product.count()
    
    if (userCount > 0 || productCount > 0) {
      console.log('⚠️  Database already contains data. Seeding will add to existing data.')
      console.log(`Current data: ${userCount} users, ${productCount} products`)
    }

    console.log('✅ Database seeding completed!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
