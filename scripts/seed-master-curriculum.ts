import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const masterCurriculum = [
  {
    name: '1. Foundations of Medicine',
    modules: ['Cell Biology', 'Genetics', 'Biochemistry', 'Embryology', 'Histology']
  },
  {
    name: '2. Human Anatomy',
    modules: ['General Anatomy', 'Regional Anatomy', 'Imaging Anatomy']
  },
  {
    name: '3. Physiology',
    modules: ['Cell physiology', 'Blood physiology', 'Cardiovascular', 'Respiratory', 'Renal', 'Gastrointestinal', 'Endocrine', 'Reproductive', 'Nervous', 'Special senses', 'Exercise physiology', 'Temperature regulation']
  },
  {
    name: '4. Pathology',
    modules: ['General Pathology', 'Systemic Pathology']
  },
  {
    name: '5. Pharmacology',
    modules: ['General', 'Drug Classes']
  },
  {
    name: '6. Microbiology',
    modules: ['Bacteriology', 'Virology', 'Mycology', 'Parasitology']
  },
  {
    name: '7. Immunology',
    modules: ['Innate immunity', 'Adaptive immunity', 'Vaccines', 'Autoimmune disease', 'Immunodeficiency', 'Transplantation', 'Hypersensitivity']
  },
  {
    name: '8. Clinical Skills',
    modules: ['History Taking', 'Physical Examination', 'Clinical reasoning', 'Documentation', 'Ward rounds', 'Patient communication', 'Consent']
  },
  {
    name: '9. Internal Medicine',
    modules: ['Cardiology', 'Respiratory', 'Gastroenterology', 'Nephrology', 'Endocrinology', 'Hematology', 'Rheumatology', 'Infectious Diseases', 'Neurology', 'Dermatology', 'Oncology']
  },
  {
    name: '10. General Surgery',
    modules: ['Principles', 'Trauma', 'Burns', 'Shock', 'Hernias', 'Breast', 'Thyroid', 'Abdomen', 'Vascular', 'Colorectal']
  },
  {
    name: '11. Surgical Specialties',
    modules: ['Neurosurgery', 'Orthopedics', 'Plastic surgery', 'Cardiothoracic', 'Urology', 'Pediatric surgery', 'Maxillofacial', 'ENT surgery', 'Ophthalmology']
  },
  {
    name: '12. Obstetrics',
    modules: ['Antenatal care', 'Labour', 'PPH', 'Eclampsia', 'Caesarean section', 'Obstetric emergencies']
  },
  {
    name: '13. Gynecology',
    modules: ['Fibroids', 'Endometriosis', 'Infertility', 'Gynecological cancers', 'Family planning']
  },
  {
    name: '14. Pediatrics',
    modules: ['Neonatology', 'Growth', 'Nutrition', 'Vaccines', 'Common childhood illness', 'Pediatric emergencies', 'Congenital disorders']
  },
  {
    name: '15. Psychiatry',
    modules: ['Depression', 'Anxiety', 'Bipolar', 'Schizophrenia', 'Suicide', 'Substance abuse', 'Child psychiatry']
  },
  {
    name: '16. Emergency Medicine',
    modules: ['ABCDE', 'Trauma', 'ACLS', 'BLS', 'PALS', 'Shock', 'Poisoning', 'Snake bites']
  },
  {
    name: '17. Intensive Care',
    modules: ['Mechanical ventilation', 'Vasopressors', 'Sepsis', 'ICU monitoring', 'Sedation', 'Organ support']
  },
  {
    name: '18. Anaesthesia',
    modules: ['Airway', 'General anaesthesia', 'Regional', 'Pain management', 'Perioperative care']
  },
  {
    name: '19. Radiology',
    modules: ['Chest X-ray', 'CT interpretation', 'MRI', 'Ultrasound', 'FAST', 'Doppler', 'Interventional radiology']
  },
  {
    name: '20. Laboratory Medicine',
    modules: ['Hematology', 'Clinical chemistry', 'Microbiology', 'Blood bank', 'Molecular diagnostics']
  },
  {
    name: '21. Community Medicine / Public Health',
    modules: ['Epidemiology', 'Biostatistics', 'Disease surveillance', 'Vaccination', 'Health promotion', 'Health economics', 'One Health']
  },
  {
    name: '22. Family Medicine',
    modules: ['Primary care', 'Chronic disease management', 'Preventive medicine', 'Home care', 'Palliative care']
  },
  {
    name: '23. Medical Ethics',
    modules: ['Confidentiality', 'Consent', 'Professionalism', 'End-of-life', 'Medical law', 'Documentation']
  },
  {
    name: '24. Evidence-Based Medicine',
    modules: ['Literature search', 'Critical appraisal', 'Clinical trials', 'Guidelines', 'Systematic reviews', 'Meta-analysis']
  },
  {
    name: '25. Research',
    modules: ['Research methodology', 'Proposal writing', 'Statistics', 'SPSS', 'R', 'Publication', 'Peer review']
  },
  {
    name: '26. Point-of-Care Ultrasound (POCUS)',
    modules: ['eFAST', 'Cardiac', 'Lung', 'Abdomen', 'Obstetric', 'Vascular access']
  },
  {
    name: '27. Medical Procedures',
    modules: ['Venipuncture', 'Cannulation', 'Lumbar puncture', 'Chest tube', 'Central line', 'Urinary catheter', 'NG tube', 'Suturing', 'Wound care', 'Intubation', 'Cricothyrotomy', 'Defibrillation', 'ECG', 'ABG', 'Paracentesis', 'Thoracentesis', 'Bone marrow biopsy', 'Joint aspiration', 'Casting and splinting']
  },
  {
    name: '28. Clinical Cases',
    modules: ['Presenting complaint', 'History', 'Examination', 'Differential diagnosis', 'Investigations', 'Diagnosis', 'Management', 'Follow-up', 'OSCE discussion', 'Viva questions', 'Key learning points']
  },
  {
    name: '29. OSCE Academy',
    modules: ['History', 'Examination', 'Communication', 'Interpretation', 'Procedures', 'Counseling', 'Prescribing', 'Emergency stations']
  },
  {
    name: '30. Exam Preparation',
    modules: ['SBA/MCQ', 'True/False', 'Extended Matching Questions', 'OSCE', 'SAQ', 'Essay', 'Clinical reasoning', 'Flashcards', 'Image quizzes', 'ECG interpretation', 'Radiology interpretation', 'Histology slides', 'Pathology specimens']
  },
  {
    name: '31. AI & Digital Medicine',
    modules: ['AI in diagnosis', 'Large language models', 'Clinical decision support', 'Medical informatics', 'Electronic health records', 'Digital therapeutics', 'Telemedicine', 'Wearables', 'Cybersecurity', 'Data privacy']
  },
  {
    name: '32. Specialty Libraries (Advanced)',
    modules: ['Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology', 'Endocrinology', 'Rheumatology', 'Pulmonology', 'Hematology', 'Oncology', 'Infectious Diseases', 'Emergency Medicine', 'Critical Care', 'General Surgery', 'Orthopedics', 'Neurosurgery', 'Plastic Surgery', 'Cardiothoracic Surgery', 'Urology', 'ENT', 'Ophthalmology', 'Obstetrics', 'Gynecology', 'Pediatrics', 'Neonatology', 'Psychiatry', 'Dermatology', 'Family Medicine', 'Public Health', 'Palliative Care', 'Sports Medicine', 'Occupational Medicine', 'Rehabilitation Medicine', 'Nuclear Medicine', 'Pain Medicine', 'Sleep Medicine', 'Clinical Nutrition', 'Medical Genetics']
  }
]

async function main() {
  console.log('Starting Master Curriculum Seed...')

  for (const item of masterCurriculum) {
    const existingCurriculum = await prisma.curriculum.findFirst({
      where: { name: item.name }
    })

    let currId = ''
    if (existingCurriculum) {
      console.log(`Curriculum "${item.name}" already exists, skipping creation.`)
      currId = existingCurriculum.id
    } else {
      const newCurr = await prisma.curriculum.create({
        data: {
          name: item.name,
          description: `Comprehensive core module for ${item.name}`,
          field: 'MEDICAL'
        }
      })
      currId = newCurr.id
      console.log(`Created Curriculum: ${item.name}`)
    }

    // Now seed the modules
    for (let i = 0; i < item.modules.length; i++) {
      const modName = item.modules[i]
      const existingMod = await prisma.module.findFirst({
        where: { name: modName, curriculumId: currId }
      })

      if (!existingMod) {
        await prisma.module.create({
          data: {
            name: modName,
            description: `Core coverage of ${modName}`,
            curriculumId: currId,
            order: i
          }
        })
        console.log(`  Created Module: ${modName}`)
      }
    }
  }

  console.log('Master Curriculum Seeding Completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
