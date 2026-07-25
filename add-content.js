const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("Adding Test Content...")
  
  // 1. Add Curriculum
  const curriculum = await prisma.curriculum.create({
    data: {
      name: 'Test Antigravity Curriculum',
      description: 'A curriculum created for testing',
      field: 'MEDICAL',
      isActive: true,
    }
  })
  console.log('Added curriculum:', curriculum.name)

  // 2. Add Book
  const book = await prisma.book.create({
    data: {
      title: 'Antigravity Test Book',
      author: 'Test Author',
      isPublished: true,
      format: 'PDF',
      tags: 'test'
    }
  })
  console.log('Added book:', book.title)

  // 3. Add Drug Class and Drug
  const drugClass = await prisma.drugClass.create({
    data: {
      name: 'Test Drug Class',
      category: 'Test Category'
    }
  })
  
  const drug = await prisma.drug.create({
    data: {
      name: 'Antigravity Test Drug',
      brandNames: 'TestBrand',
      indications: 'Testing',
      contraindications: 'None',
      warnings: 'None',
      sideEffectsCommon: 'None',
      sideEffectsSerious: 'None',
      sideEffectsRare: 'None',
      interactions: 'None',
      monitoring: 'None',
      drugClassId: drugClass.id,
      isActive: true,
    }
  })
  console.log('Added drug:', drug.name)
}

main().catch(console.error).finally(() => prisma.$disconnect())
