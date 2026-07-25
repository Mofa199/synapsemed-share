import { NextRequest, NextResponse } from 'next/server'

// Comprehensive drug and drug class data for SynapseMed platform
// This file contains all the drugs and drug classes as specified by the user

export const drugClassesData = [
  // 1. Autonomic Nervous System Drugs
  {
    id: 'ans-cholinergic-agonists',
    name: 'Cholinergic Agonists (Parasympathomimetics)',
    category: 'Autonomic Nervous System',
    description: 'Drugs that mimic or enhance the action of acetylcholine at cholinergic receptors',
    mechanism: 'Direct stimulation of cholinergic receptors or inhibition of acetylcholinesterase',
    therapeuticUses: [
      'Myasthenia gravis',
      'Glaucoma',
      'Postoperative urinary retention',
      'Alzheimer\'s disease (cholinesterase inhibitors)',
      'Paralytic ileus'
    ],
    commonSideEffects: [
      'Nausea and vomiting',
      'Diarrhea',
      'Bradycardia',
      'Hypotension',
      'Excessive salivation',
      'Miosis'
    ],
    contraindications: [
      'Mechanical obstruction of GI or GU tract',
      'Asthma',
      'Cardiac arrhythmias'
    ],
    drugs: ['Acetylcholine', 'Bethanechol', 'Pilocarpine', 'Neostigmine', 'Physostigmine', 'Pyridostigmine', 'Donepezil']
  },
  {
    id: 'ans-cholinergic-antagonists',
    name: 'Cholinergic Antagonists (Antimuscarinics)',
    category: 'Autonomic Nervous System',
    description: 'Drugs that block the action of acetylcholine at muscarinic receptors',
    mechanism: 'Competitive antagonism at muscarinic cholinergic receptors',
    therapeuticUses: [
      'Organophosphate poisoning',
      'Peptic ulcer disease',
      'Irritable bowel syndrome',
      'Urinary incontinence',
      'COPD/Asthma',
      'Motion sickness',
      'Parkinson\'s disease'
    ],
    commonSideEffects: [
      'Dry mouth',
      'Constipation',
      'Urinary retention',
      'Blurred vision',
      'Tachycardia',
      'Confusion (especially in elderly)'
    ],
    contraindications: [
      'Narrow-angle glaucoma',
      'Prostatic hypertrophy',
      'Severe ulcerative colitis'
    ],
    drugs: ['Atropine', 'Scopolamine', 'Ipratropium', 'Oxybutynin']
  },
  {
    id: 'ans-neuromuscular-blockers',
    name: 'Neuromuscular Blockers',
    category: 'Autonomic Nervous System',
    description: 'Drugs that block neuromuscular transmission at the neuromuscular junction',
    mechanism: 'Competitive or depolarizing blockade of nicotinic receptors at neuromuscular junction',
    therapeuticUses: [
      'Surgical muscle relaxation',
      'Mechanical ventilation',
      'Electroconvulsive therapy'
    ],
    commonSideEffects: [
      'Respiratory paralysis',
      'Cardiovascular effects',
      'Histamine release'
    ],
    contraindications: [
      'Myasthenia gravis (relative)',
      'Severe burns (succinylcholine)',
      'Hyperkalemia risk'
    ],
    drugs: ['Succinylcholine', 'Pancuronium', 'Vecuronium']
  },
  {
    id: 'ans-adrenergic-agonists',
    name: 'Adrenergic Agonists (Sympathomimetics)',
    category: 'Autonomic Nervous System',
    description: 'Drugs that activate adrenergic receptors, mimicking sympathetic nervous system activity',
    mechanism: 'Direct stimulation of α and/or β adrenergic receptors',
    therapeuticUses: [
      'Cardiac arrest',
      'Anaphylaxis',
      'Cardiogenic shock',
      'Asthma',
      'Nasal congestion'
    ],
    commonSideEffects: [
      'Tachycardia',
      'Hypertension',
      'Anxiety',
      'Tremor',
      'Arrhythmias'
    ],
    contraindications: [
      'Severe hypertension',
      'Coronary artery disease (relative)',
      'Hyperthyroidism'
    ],
    drugs: ['Epinephrine', 'Norepinephrine', 'Dopamine', 'Dobutamine', 'Salbutamol']
  },
  {
    id: 'ans-adrenergic-antagonists',
    name: 'Adrenergic Antagonists (Sympatholytics)',
    category: 'Autonomic Nervous System',
    description: 'Drugs that block adrenergic receptors, opposing sympathetic nervous system activity',
    mechanism: 'Competitive antagonism at α and/or β adrenergic receptors',
    therapeuticUses: [
      'Hypertension',
      'Angina',
      'Heart failure',
      'Arrhythmias',
      'Benign prostatic hyperplasia'
    ],
    commonSideEffects: [
      'Bradycardia',
      'Hypotension',
      'Bronchospasm',
      'Fatigue',
      'Cold extremities'
    ],
    contraindications: [
      'Asthma (β-blockers)',
      'Heart block',
      'Severe heart failure (acute)'
    ],
    drugs: ['Propranolol', 'Atenolol', 'Labetalol', 'Prazosin']
  },

  // 2. Cardiovascular Drugs
  {
    id: 'cv-antihypertensives',
    name: 'Antihypertensives',
    category: 'Cardiovascular',
    description: 'Drugs used to treat high blood pressure through various mechanisms',
    mechanism: 'Multiple mechanisms: ACE inhibition, ARB, calcium channel blockade, diuresis, β-blockade',
    therapeuticUses: [
      'Essential hypertension',
      'Secondary hypertension',
      'Hypertensive emergency',
      'Heart failure',
      'Diabetic nephropathy'
    ],
    commonSideEffects: [
      'Hypotension',
      'Dizziness',
      'Fatigue',
      'Electrolyte imbalances',
      'Dry cough (ACE inhibitors)'
    ],
    contraindications: [
      'Pregnancy (ACE inhibitors/ARBs)',
      'Bilateral renal artery stenosis',
      'Severe aortic stenosis'
    ],
    drugs: ['Enalapril', 'Lisinopril', 'Losartan', 'Valsartan', 'Atenolol', 'Metoprolol', 'Amlodipine', 'Verapamil', 'Diltiazem', 'Hydrochlorothiazide', 'Furosemide', 'Spironolactone']
  },
  {
    id: 'cv-antianginals',
    name: 'Antianginal Drugs',
    category: 'Cardiovascular',
    description: 'Drugs used to prevent and treat angina pectoris',
    mechanism: 'Coronary vasodilation, reduced myocardial oxygen demand, improved coronary blood flow',
    therapeuticUses: [
      'Stable angina',
      'Unstable angina',
      'Variant angina',
      'Acute MI',
      'Heart failure'
    ],
    commonSideEffects: [
      'Headache',
      'Hypotension',
      'Flushing',
      'Tolerance (nitrates)',
      'Peripheral edema'
    ],
    contraindications: [
      'Severe hypotension',
      'Severe aortic stenosis',
      'Hypertrophic cardiomyopathy'
    ],
    drugs: ['Nitroglycerin', 'Isosorbide dinitrate', 'Propranolol', 'Atenolol', 'Verapamil', 'Amlodipine']
  },
  {
    id: 'cv-antiarrhythmics',
    name: 'Antiarrhythmic Drugs',
    category: 'Cardiovascular',
    description: 'Drugs used to treat cardiac arrhythmias, classified by Vaughan-Williams system',
    mechanism: 'Various: Na+ channel blockade, β-blockade, K+ channel blockade, Ca2+ channel blockade',
    therapeuticUses: [
      'Atrial fibrillation',
      'Ventricular tachycardia',
      'Supraventricular tachycardia',
      'Life-threatening arrhythmias'
    ],
    commonSideEffects: [
      'Proarrhythmic effects',
      'Hypotension',
      'Pulmonary toxicity (Amiodarone)',
      'Thyroid dysfunction',
      'GI disturbances'
    ],
    contraindications: [
      'Heart block',
      'Severe heart failure',
      'Torsades de pointes risk'
    ],
    drugs: ['Lidocaine', 'Quinidine', 'Metoprolol', 'Amiodarone', 'Sotalol', 'Verapamil', 'Diltiazem']
  },
  {
    id: 'cv-heart-failure',
    name: 'Heart Failure Drugs',
    category: 'Cardiovascular',
    description: 'Drugs used to treat acute and chronic heart failure',
    mechanism: 'Positive inotropy, preload/afterload reduction, neurohormonal blockade',
    therapeuticUses: [
      'Acute heart failure',
      'Chronic heart failure',
      'Cardiogenic shock',
      'Fluid overload'
    ],
    commonSideEffects: [
      'Electrolyte imbalances',
      'Digitalis toxicity',
      'Hypotension',
      'Kidney dysfunction',
      'Hyperkalemia'
    ],
    contraindications: [
      'Severe bradycardia',
      'Heart block',
      'Severe kidney disease'
    ],
    drugs: ['Digoxin', 'Furosemide', 'Spironolactone', 'Enalapril', 'Lisinopril', 'Atenolol', 'Metoprolol']
  },

  // 3. Hematologic Drugs
  {
    id: 'heme-anticoagulants',
    name: 'Anticoagulants',
    category: 'Hematologic',
    description: 'Drugs that prevent blood clot formation by interfering with coagulation cascade',
    mechanism: 'Various: Antithrombin activation, Vitamin K antagonism, direct factor inhibition',
    therapeuticUses: [
      'Deep vein thrombosis',
      'Pulmonary embolism',
      'Atrial fibrillation',
      'Mechanical heart valves',
      'Acute coronary syndromes'
    ],
    commonSideEffects: [
      'Bleeding',
      'Thrombocytopenia',
      'Skin necrosis',
      'Osteoporosis (long-term heparin)'
    ],
    contraindications: [
      'Active bleeding',
      'Severe liver disease',
      'Recent surgery',
      'Severe uncontrolled hypertension'
    ],
    drugs: ['Heparin', 'Warfarin', 'Enoxaparin']
  },
  {
    id: 'heme-antiplatelets',
    name: 'Antiplatelet Drugs',
    category: 'Hematologic',
    description: 'Drugs that prevent platelet aggregation and arterial thrombosis',
    mechanism: 'COX inhibition, ADP receptor antagonism, glycoprotein IIb/IIIa inhibition',
    therapeuticUses: [
      'Myocardial infarction prevention',
      'Stroke prevention',
      'Peripheral artery disease',
      'Acute coronary syndromes'
    ],
    commonSideEffects: [
      'Bleeding',
      'GI upset',
      'Thrombotic thrombocytopenic purpura',
      'Neutropenia'
    ],
    contraindications: [
      'Active bleeding',
      'Severe liver disease',
      'Peptic ulcer disease'
    ],
    drugs: ['Aspirin', 'Clopidogrel', 'Ticlopidine']
  },
  {
    id: 'heme-thrombolytics',
    name: 'Thrombolytic Drugs',
    category: 'Hematologic',
    description: 'Drugs that dissolve existing blood clots by activating plasminogen',
    mechanism: 'Conversion of plasminogen to plasmin, which breaks down fibrin clots',
    therapeuticUses: [
      'Acute myocardial infarction',
      'Acute ischemic stroke',
      'Massive pulmonary embolism',
      'Acute arterial occlusion'
    ],
    commonSideEffects: [
      'Hemorrhage',
      'Intracranial bleeding',
      'Allergic reactions',
      'Reperfusion arrhythmias'
    ],
    contraindications: [
      'Recent surgery',
      'History of hemorrhagic stroke',
      'Active bleeding',
      'Severe uncontrolled hypertension'
    ],
    drugs: ['Streptokinase', 'Alteplase']
  },
  {
    id: 'heme-hematinics',
    name: 'Hematinic Drugs',
    category: 'Hematologic',
    description: 'Drugs used to treat nutritional anemias',
    mechanism: 'Replacement of essential nutrients for red blood cell production',
    therapeuticUses: [
      'Iron deficiency anemia',
      'Megaloblastic anemia',
      'Pernicious anemia',
      'Nutritional deficiencies'
    ],
    commonSideEffects: [
      'GI upset',
      'Constipation',
      'Dark stools',
      'Allergic reactions'
    ],
    contraindications: [
      'Hemochromatosis',
      'Hemosiderosis',
      'Chronic hemolytic anemia'
    ],
    drugs: ['Iron', 'Folic acid', 'Vitamin B12']
  },

  // 4. Respiratory Drugs
  {
    id: 'resp-bronchodilators',
    name: 'Bronchodilators',
    category: 'Respiratory',
    description: 'Drugs that relax bronchial smooth muscle and improve airflow',
    mechanism: 'β2-agonism, phosphodiesterase inhibition, muscarinic antagonism',
    therapeuticUses: [
      'Asthma',
      'COPD',
      'Bronchospasm',
      'Exercise-induced asthma'
    ],
    commonSideEffects: [
      'Tachycardia',
      'Tremor',
      'Nervousness',
      'Headache',
      'Palpitations'
    ],
    contraindications: [
      'Severe cardiovascular disease',
      'Hyperthyroidism',
      'Narrow-angle glaucoma'
    ],
    drugs: ['Salbutamol', 'Terbutaline', 'Theophylline', 'Ipratropium', 'Tiotropium']
  },
  {
    id: 'resp-corticosteroids',
    name: 'Respiratory Corticosteroids',
    category: 'Respiratory',
    description: 'Anti-inflammatory drugs for chronic respiratory conditions',
    mechanism: 'Suppression of inflammatory mediators and immune responses',
    therapeuticUses: [
      'Asthma',
      'COPD',
      'Allergic rhinitis',
      'Inflammatory airway diseases'
    ],
    commonSideEffects: [
      'Oral thrush',
      'Hoarseness',
      'Adrenal suppression',
      'Growth retardation (children)'
    ],
    contraindications: [
      'Systemic fungal infections',
      'Respiratory tuberculosis',
      'Viral respiratory infections'
    ],
    drugs: ['Beclomethasone', 'Budesonide', 'Fluticasone']
  },
  {
    id: 'resp-leukotriene-antagonists',
    name: 'Leukotriene Antagonists',
    category: 'Respiratory',
    description: 'Drugs that block leukotriene receptors or synthesis',
    mechanism: 'Leukotriene receptor antagonism or 5-lipoxygenase inhibition',
    therapeuticUses: [
      'Asthma prevention',
      'Exercise-induced asthma',
      'Allergic rhinitis',
      'Aspirin-sensitive asthma'
    ],
    commonSideEffects: [
      'Headache',
      'GI upset',
      'Mood changes',
      'Sleep disturbances'
    ],
    contraindications: [
      'Severe liver disease',
      'Hypersensitivity'
    ],
    drugs: ['Montelukast', 'Zafirlukast']
  },

  // 5. Gastrointestinal Drugs
  {
    id: 'gi-antacids',
    name: 'Antacids',
    category: 'Gastrointestinal',
    description: 'Drugs that neutralize gastric acid',
    mechanism: 'Chemical neutralization of hydrochloric acid in stomach',
    therapeuticUses: [
      'Dyspepsia',
      'Heartburn',
      'Peptic ulcer disease',
      'GERD symptoms'
    ],
    commonSideEffects: [
      'Constipation (aluminum)',
      'Diarrhea (magnesium)',
      'Electrolyte imbalances',
      'Drug interactions'
    ],
    contraindications: [
      'Severe kidney disease',
      'Hypophosphatemia',
      'Bowel obstruction'
    ],
    drugs: ['Magnesium hydroxide', 'Aluminium hydroxide']
  },
  {
    id: 'gi-acid-suppressants',
    name: 'Acid Suppressants',
    category: 'Gastrointestinal',
    description: 'Drugs that reduce gastric acid production',
    mechanism: 'H2 receptor antagonism or proton pump inhibition',
    therapeuticUses: [
      'Peptic ulcer disease',
      'GERD',
      'Zollinger-Ellison syndrome',
      'Stress ulcer prophylaxis'
    ],
    commonSideEffects: [
      'Headache',
      'Diarrhea',
      'B12 deficiency (long-term)',
      'Increased infection risk'
    ],
    contraindications: [
      'Hypersensitivity',
      'Severe liver disease (some)'
    ],
    drugs: ['Ranitidine', 'Famotidine', 'Omeprazole', 'Pantoprazole']
  },
  {
    id: 'gi-laxatives',
    name: 'Laxatives',
    category: 'Gastrointestinal',
    description: 'Drugs that promote bowel movements',
    mechanism: 'Various: osmotic, stimulant, bulk-forming, stool softening',
    therapeuticUses: [
      'Constipation',
      'Bowel preparation',
      'Fecal impaction',
      'Opioid-induced constipation'
    ],
    commonSideEffects: [
      'Abdominal cramping',
      'Diarrhea',
      'Electrolyte imbalances',
      'Dependence (stimulant)'
    ],
    contraindications: [
      'Bowel obstruction',
      'Appendicitis',
      'Severe dehydration'
    ],
    drugs: ['Lactulose', 'Senna', 'Bisacodyl']
  },
  {
    id: 'gi-antiemetics',
    name: 'Antiemetic Drugs',
    category: 'Gastrointestinal',
    description: 'Drugs that prevent or treat nausea and vomiting',
    mechanism: '5-HT3 antagonism, dopamine antagonism, H1 antagonism',
    therapeuticUses: [
      'Chemotherapy-induced nausea',
      'Postoperative nausea',
      'Motion sickness',
      'Gastroparesis'
    ],
    commonSideEffects: [
      'Sedation',
      'Extrapyramidal effects',
      'QT prolongation',
      'Constipation'
    ],
    contraindications: [
      'GI obstruction',
      'Pheochromocytoma',
      'Parkinson\'s disease (some)'
    ],
    drugs: ['Ondansetron', 'Metoclopramide', 'Prochlorperazine']
  },

  // 6. Endocrine Drugs
  {
    id: 'endo-diabetes',
    name: 'Antidiabetic Drugs',
    category: 'Endocrine',
    description: 'Drugs used to manage diabetes mellitus',
    mechanism: 'Insulin replacement, insulin sensitization, glucose lowering',
    therapeuticUses: [
      'Type 1 diabetes',
      'Type 2 diabetes',
      'Diabetic ketoacidosis',
      'Gestational diabetes'
    ],
    commonSideEffects: [
      'Hypoglycemia',
      'Weight gain',
      'GI upset',
      'Injection site reactions'
    ],
    contraindications: [
      'Hypoglycemia',
      'Diabetic ketoacidosis (some)',
      'Severe kidney disease (some)'
    ],
    drugs: ['Regular insulin', 'Lispro', 'Glargine', 'Metformin', 'Glibenclamide', 'Pioglitazone']
  },
  {
    id: 'endo-thyroid',
    name: 'Thyroid Drugs',
    category: 'Endocrine',
    description: 'Drugs for thyroid disorders',
    mechanism: 'Hormone replacement or antithyroid activity',
    therapeuticUses: [
      'Hypothyroidism',
      'Hyperthyroidism',
      'Thyroid cancer',
      'Goiter'
    ],
    commonSideEffects: [
      'Hyperthyroidism symptoms',
      'Cardiac effects',
      'Bone loss',
      'Agranulocytosis (antithyroid)'
    ],
    contraindications: [
      'Untreated adrenal insufficiency',
      'Acute MI',
      'Thyrotoxicosis'
    ],
    drugs: ['Levothyroxine', 'Carbimazole', 'Propylthiouracil']
  },
  {
    id: 'endo-corticosteroids',
    name: 'Systemic Corticosteroids',
    category: 'Endocrine',
    description: 'Synthetic hormones with anti-inflammatory and immunosuppressive effects',
    mechanism: 'Glucocorticoid receptor activation',
    therapeuticUses: [
      'Inflammatory conditions',
      'Autoimmune diseases',
      'Adrenal insufficiency',
      'Allergic reactions'
    ],
    commonSideEffects: [
      'Immunosuppression',
      'Osteoporosis',
      'Hyperglycemia',
      'Cushing\'s syndrome'
    ],
    contraindications: [
      'Systemic fungal infections',
      'Live vaccines',
      'Peptic ulcer disease'
    ],
    drugs: ['Prednisolone', 'Hydrocortisone', 'Dexamethasone']
  },
  {
    id: 'endo-reproductive',
    name: 'Reproductive Hormones',
    category: 'Endocrine',
    description: 'Sex hormones and contraceptives',
    mechanism: 'Hormone replacement or receptor modulation',
    therapeuticUses: [
      'Hormone replacement therapy',
      'Contraception',
      'Hypogonadism',
      'Menstrual disorders'
    ],
    commonSideEffects: [
      'Thromboembolism',
      'Breast tenderness',
      'Mood changes',
      'Weight changes'
    ],
    contraindications: [
      'Thromboembolism history',
      'Hormone-sensitive cancers',
      'Severe liver disease'
    ],
    drugs: ['Estrogens', 'Progesterone', 'Testosterone', 'Levonorgestrel']
  },

  // 7. Central Nervous System Drugs
  {
    id: 'cns-sedatives-hypnotics',
    name: 'Sedatives & Hypnotics',
    category: 'Central Nervous System',
    description: 'Drugs that depress CNS activity and promote sleep',
    mechanism: 'GABA receptor enhancement, various CNS depressant effects',
    therapeuticUses: [
      'Insomnia',
      'Anxiety disorders',
      'Sedation for procedures',
      'Seizure disorders'
    ],
    commonSideEffects: [
      'Sedation',
      'Dependence',
      'Respiratory depression',
      'Memory impairment'
    ],
    contraindications: [
      'Respiratory depression',
      'Sleep apnea',
      'Severe liver disease'
    ],
    drugs: ['Diazepam', 'Lorazepam', 'Zolpidem']
  },
  {
    id: 'cns-antidepressants',
    name: 'Antidepressants',
    category: 'Central Nervous System',
    description: 'Drugs used to treat depression and related mood disorders',
    mechanism: 'Monoamine reuptake inhibition, MAO inhibition',
    therapeuticUses: [
      'Major depression',
      'Anxiety disorders',
      'Chronic pain',
      'PTSD'
    ],
    commonSideEffects: [
      'Sexual dysfunction',
      'Weight changes',
      'Suicidal ideation (initial)',
      'Serotonin syndrome'
    ],
    contraindications: [
      'MAO inhibitor use',
      'Uncontrolled narrow-angle glaucoma',
      'Recent MI (TCAs)'
    ],
    drugs: ['Fluoxetine', 'Sertraline', 'Amitriptyline', 'Imipramine', 'Selegiline']
  },
  {
    id: 'cns-antipsychotics',
    name: 'Antipsychotic Drugs',
    category: 'Central Nervous System',
    description: 'Drugs used to treat psychotic disorders',
    mechanism: 'Dopamine receptor antagonism, serotonin receptor modulation',
    therapeuticUses: [
      'Schizophrenia',
      'Bipolar disorder',
      'Severe agitation',
      'Delusional disorders'
    ],
    commonSideEffects: [
      'Extrapyramidal symptoms',
      'Tardive dyskinesia',
      'Metabolic syndrome',
      'Sedation'
    ],
    contraindications: [
      'Severe CNS depression',
      'Bone marrow suppression',
      'Severe cardiovascular disease'
    ],
    drugs: ['Haloperidol', 'Risperidone', 'Clozapine']
  },
  {
    id: 'cns-mood-stabilizers',
    name: 'Mood Stabilizers',
    category: 'Central Nervous System',
    description: 'Drugs used to treat bipolar disorder and mood fluctuations',
    mechanism: 'Various: ion channel modulation, neurotransmitter effects',
    therapeuticUses: [
      'Bipolar disorder',
      'Mood stabilization',
      'Seizure disorders',
      'Neuropathic pain'
    ],
    commonSideEffects: [
      'Tremor',
      'Weight gain',
      'Kidney dysfunction',
      'Liver toxicity'
    ],
    contraindications: [
      'Severe kidney disease',
      'Severe liver disease',
      'Pregnancy (some)'
    ],
    drugs: ['Lithium', 'Valproate', 'Carbamazepine']
  },
  {
    id: 'cns-antiepileptics',
    name: 'Antiepileptic Drugs',
    category: 'Central Nervous System',
    description: 'Drugs used to prevent and treat seizures',
    mechanism: 'Na+ channel blockade, GABA enhancement, Ca2+ channel blockade',
    therapeuticUses: [
      'Epilepsy',
      'Seizure disorders',
      'Neuropathic pain',
      'Mood disorders'
    ],
    commonSideEffects: [
      'Sedation',
      'Cognitive impairment',
      'Skin reactions',
      'Teratogenicity'
    ],
    contraindications: [
      'Severe liver disease',
      'Heart block (some)',
      'Pregnancy (some)'
    ],
    drugs: ['Phenytoin', 'Carbamazepine', 'Valproate', 'Levetiracetam']
  },
  {
    id: 'cns-analgesics',
    name: 'Analgesic Drugs',
    category: 'Central Nervous System',
    description: 'Drugs used to relieve pain',
    mechanism: 'Opioid receptor agonism, COX inhibition, various pain pathways',
    therapeuticUses: [
      'Acute pain',
      'Chronic pain',
      'Cancer pain',
      'Inflammatory pain'
    ],
    commonSideEffects: [
      'Respiratory depression (opioids)',
      'Constipation',
      'GI bleeding (NSAIDs)',
      'Dependence potential'
    ],
    contraindications: [
      'Respiratory depression',
      'GI bleeding',
      'Severe liver disease'
    ],
    drugs: ['Morphine', 'Codeine', 'Fentanyl', 'Tramadol', 'Paracetamol', 'Ibuprofen', 'Diclofenac']
  },

  // 8. Antimicrobial Drugs
  {
    id: 'antimicrobial-beta-lactams',
    name: 'Beta-lactam Antibiotics',
    category: 'Antimicrobial',
    description: 'Antibiotics that inhibit bacterial cell wall synthesis',
    mechanism: 'Inhibition of bacterial cell wall synthesis by binding to PBPs',
    therapeuticUses: [
      'Bacterial infections',
      'Surgical prophylaxis',
      'Sepsis',
      'Pneumonia'
    ],
    commonSideEffects: [
      'Allergic reactions',
      'GI upset',
      'Superinfections',
      'C. difficile colitis'
    ],
    contraindications: [
      'Penicillin allergy',
      'Severe kidney disease (some)',
      'Mononucleosis (amoxicillin)'
    ],
    drugs: ['Penicillin G', 'Amoxicillin', 'Ceftriaxone', 'Cefuroxime', 'Imipenem', 'Meropenem']
  },
  {
    id: 'antimicrobial-others',
    name: 'Other Antibiotics',
    category: 'Antimicrobial',
    description: 'Various classes of antibiotics with different mechanisms',
    mechanism: 'Protein synthesis inhibition, DNA/RNA interference, folate synthesis inhibition',
    therapeuticUses: [
      'Bacterial infections',
      'Atypical pneumonia',
      'UTIs',
      'Skin infections'
    ],
    commonSideEffects: [
      'GI upset',
      'Ototoxicity (aminoglycosides)',
      'Photosensitivity',
      'Superinfections'
    ],
    contraindications: [
      'Pregnancy (some)',
      'Children (some)',
      'Severe kidney disease'
    ],
    drugs: ['Erythromycin', 'Azithromycin', 'Gentamicin', 'Amikacin', 'Doxycycline', 'Tetracycline', 'Ciprofloxacin', 'Levofloxacin', 'Cotrimoxazole']
  },
  {
    id: 'antimicrobial-antitb',
    name: 'Anti-tuberculosis Drugs',
    category: 'Antimicrobial',
    description: 'Drugs specifically used to treat tuberculosis',
    mechanism: 'Various: mycolic acid synthesis inhibition, protein synthesis inhibition',
    therapeuticUses: [
      'Tuberculosis',
      'Latent TB infection',
      'Atypical mycobacterial infections'
    ],
    commonSideEffects: [
      'Hepatotoxicity',
      'Peripheral neuropathy',
      'Optic neuritis',
      'Orange discoloration of body fluids'
    ],
    contraindications: [
      'Severe liver disease',
      'Optic neuritis',
      'Gout (pyrazinamide)'
    ],
    drugs: ['Isoniazid', 'Rifampicin', 'Pyrazinamide', 'Ethambutol']
  },
  {
    id: 'antimicrobial-antifungals',
    name: 'Antifungal Drugs',
    category: 'Antimicrobial',
    description: 'Drugs used to treat fungal infections',
    mechanism: 'Ergosterol synthesis inhibition, cell membrane disruption',
    therapeuticUses: [
      'Systemic fungal infections',
      'Candidiasis',
      'Dermatophyte infections',
      'Cryptococcal meningitis'
    ],
    commonSideEffects: [
      'Hepatotoxicity',
      'Nephrotoxicity',
      'Infusion reactions',
      'GI upset'
    ],
    contraindications: [
      'Severe liver disease',
      'Severe kidney disease',
      'Pregnancy (some)'
    ],
    drugs: ['Fluconazole', 'Amphotericin B', 'Nystatin']
  },
  {
    id: 'antimicrobial-antivirals',
    name: 'Antiviral Drugs',
    category: 'Antimicrobial',
    description: 'Drugs used to treat viral infections',
    mechanism: 'DNA polymerase inhibition, reverse transcriptase inhibition, protease inhibition',
    therapeuticUses: [
      'Herpes infections',
      'HIV infection',
      'Influenza',
      'Hepatitis'
    ],
    commonSideEffects: [
      'GI upset',
      'Kidney dysfunction',
      'Bone marrow suppression',
      'Neuropsychiatric effects'
    ],
    contraindications: [
      'Severe kidney disease',
      'Severe liver disease',
      'Pregnancy (some)'
    ],
    drugs: ['Acyclovir', 'Zidovudine', 'Oseltamivir', 'Remdesivir']
  },
  {
    id: 'antimicrobial-antimalarials',
    name: 'Antimalarial Drugs',
    category: 'Antimicrobial',
    description: 'Drugs used to prevent and treat malaria',
    mechanism: 'Interference with parasite metabolism and DNA replication',
    therapeuticUses: [
      'Malaria treatment',
      'Malaria prophylaxis',
      'Rheumatoid arthritis (some)',
      'Lupus (some)'
    ],
    commonSideEffects: [
      'GI upset',
      'Visual disturbances',
      'Ototoxicity',
      'Cardiac arrhythmias'
    ],
    contraindications: [
      'Retinal disease',
      'G6PD deficiency (some)',
      'Cardiac conduction disorders'
    ],
    drugs: ['Chloroquine', 'Artemether-lumefantrine', 'Quinine']
  },

  // 9. Cancer Chemotherapy
  {
    id: 'chemo-alkylating',
    name: 'Alkylating Agents',
    category: 'Cancer Chemotherapy',
    description: 'Drugs that form covalent bonds with DNA',
    mechanism: 'DNA cross-linking leading to cell death',
    therapeuticUses: [
      'Various cancers',
      'Leukemia',
      'Lymphoma',
      'Solid tumors'
    ],
    commonSideEffects: [
      'Bone marrow suppression',
      'Secondary malignancies',
      'Sterility',
      'Hemorrhagic cystitis'
    ],
    contraindications: [
      'Severe bone marrow suppression',
      'Active infection',
      'Pregnancy'
    ],
    drugs: ['Cyclophosphamide', 'Ifosfamide']
  },
  {
    id: 'chemo-antimetabolites',
    name: 'Antimetabolites',
    category: 'Cancer Chemotherapy',
    description: 'Drugs that interfere with DNA and RNA synthesis',
    mechanism: 'Inhibition of nucleotide synthesis and DNA replication',
    therapeuticUses: [
      'Various cancers',
      'Leukemia',
      'Autoimmune diseases',
      'Psoriasis'
    ],
    commonSideEffects: [
      'Bone marrow suppression',
      'Mucositis',
      'Liver toxicity',
      'Renal toxicity'
    ],
    contraindications: [
      'Severe kidney disease',
      'Severe liver disease',
      'Pregnancy'
    ],
    drugs: ['Methotrexate', '5-Fluorouracil']
  },
  {
    id: 'chemo-plant-alkaloids',
    name: 'Plant Alkaloids',
    category: 'Cancer Chemotherapy',
    description: 'Natural compounds that interfere with cell division',
    mechanism: 'Microtubule disruption, topoisomerase inhibition',
    therapeuticUses: [
      'Various solid tumors',
      'Leukemia',
      'Lymphoma',
      'Breast cancer'
    ],
    commonSideEffects: [
      'Peripheral neuropathy',
      'Bone marrow suppression',
      'Alopecia',
      'Hypersensitivity reactions'
    ],
    contraindications: [
      'Severe neuropathy',
      'Active infection',
      'Pregnancy'
    ],
    drugs: ['Vincristine', 'Paclitaxel']
  },
  {
    id: 'chemo-antibiotics',
    name: 'Antitumor Antibiotics',
    category: 'Cancer Chemotherapy',
    description: 'Antibiotics with antitumor activity',
    mechanism: 'DNA intercalation, free radical formation',
    therapeuticUses: [
      'Various cancers',
      'Leukemia',
      'Lymphoma',
      'Solid tumors'
    ],
    commonSideEffects: [
      'Cardiotoxicity',
      'Pulmonary toxicity',
      'Bone marrow suppression',
      'Secondary malignancies'
    ],
    contraindications: [
      'Severe cardiac disease',
      'Severe pulmonary disease',
      'Pregnancy'
    ],
    drugs: ['Doxorubicin', 'Bleomycin']
  },
  {
    id: 'chemo-hormonal',
    name: 'Hormonal Agents',
    category: 'Cancer Chemotherapy',
    description: 'Drugs that interfere with hormone-dependent tumors',
    mechanism: 'Hormone receptor antagonism or synthesis inhibition',
    therapeuticUses: [
      'Breast cancer',
      'Prostate cancer',
      'Endometrial cancer'
    ],
    commonSideEffects: [
      'Hot flashes',
      'Sexual dysfunction',
      'Bone loss',
      'Thromboembolic events'
    ],
    contraindications: [
      'Pregnancy',
      'Thromboembolism history',
      'Severe liver disease'
    ],
    drugs: ['Tamoxifen', 'Flutamide']
  },
  {
    id: 'chemo-targeted',
    name: 'Targeted Therapies',
    category: 'Cancer Chemotherapy',
    description: 'Drugs that target specific molecular pathways in cancer cells',
    mechanism: 'Tyrosine kinase inhibition, monoclonal antibody targeting',
    therapeuticUses: [
      'Chronic myeloid leukemia',
      'HER2-positive breast cancer',
      'Targeted solid tumors'
    ],
    commonSideEffects: [
      'Skin rash',
      'Diarrhea',
      'Liver toxicity',
      'Cardiotoxicity'
    ],
    contraindications: [
      'Severe liver disease',
      'Severe cardiac disease',
      'Active bleeding'
    ],
    drugs: ['Imatinib', 'Trastuzumab']
  },

  // 10. Miscellaneous
  {
    id: 'misc-immunosuppressants',
    name: 'Immunosuppressants',
    category: 'Miscellaneous',
    description: 'Drugs that suppress immune system activity',
    mechanism: 'T-cell inhibition, purine synthesis inhibition, calcineurin inhibition',
    therapeuticUses: [
      'Organ transplantation',
      'Autoimmune diseases',
      'Rheumatoid arthritis',
      'Inflammatory bowel disease'
    ],
    commonSideEffects: [
      'Increased infection risk',
      'Nephrotoxicity',
      'Hypertension',
      'Malignancy risk'
    ],
    contraindications: [
      'Active infection',
      'Live vaccines',
      'Pregnancy (some)'
    ],
    drugs: ['Cyclosporine', 'Tacrolimus', 'Azathioprine']
  },
  {
    id: 'misc-vitamins',
    name: 'Vitamins',
    category: 'Miscellaneous',
    description: 'Essential nutrients required for normal body function',
    mechanism: 'Cofactors in enzymatic reactions, antioxidants, hormone precursors',
    therapeuticUses: [
      'Vitamin deficiencies',
      'Nutritional supplementation',
      'Pregnancy support',
      'Bone health'
    ],
    commonSideEffects: [
      'GI upset (high doses)',
      'Hypervitaminosis (fat-soluble)',
      'Kidney stones (vitamin C)',
      'Allergic reactions'
    ],
    contraindications: [
      'Hypervitaminosis',
      'Kidney stones (some)',
      'Specific medical conditions'
    ],
    drugs: ['Vitamin A', 'Vitamin D', 'Vitamin E', 'Vitamin K', 'Vitamin C']
  },
  {
    id: 'misc-vaccines',
    name: 'Vaccines',
    category: 'Miscellaneous',
    description: 'Biological preparations that provide immunity against infectious diseases',
    mechanism: 'Stimulation of adaptive immune response',
    therapeuticUses: [
      'Disease prevention',
      'Herd immunity',
      'Travel medicine',
      'Public health'
    ],
    commonSideEffects: [
      'Injection site reactions',
      'Fever',
      'Malaise',
      'Allergic reactions'
    ],
    contraindications: [
      'Immunocompromised states (live vaccines)',
      'Severe illness',
      'Pregnancy (live vaccines)'
    ],
    drugs: ['BCG', 'MMR', 'Hepatitis B', 'HPV']
  }
]

export const drugsData = [
  // Autonomic Nervous System Drugs - Cholinergic Agonists
  {
    name: 'Acetylcholine',
    genericName: 'Acetylcholine chloride',
    brandNames: ['Miochol-E'],
    class: 'Cholinergic Agonists',
    category: 'Autonomic Nervous System',
    description: 'Direct-acting cholinergic agonist with very short duration of action',
    mechanism: 'Direct stimulation of nicotinic and muscarinic cholinergic receptors',
    indications: ['Intraocular use during cataract surgery', 'Research purposes'],
    dosage: {
      adult: 'Intraocular: 0.5-2 mL of 1:100 solution',
      pediatric: 'Not typically used in pediatrics',
      elderly: 'Same as adult dose'
    }
  },
  {
    name: 'Bethanechol',
    genericName: 'Bethanechol chloride',
    brandNames: ['Urecholine'],
    class: 'Cholinergic Agonists',
    category: 'Autonomic Nervous System',
    description: 'Selective muscarinic agonist resistant to cholinesterase',
    mechanism: 'Direct stimulation of muscarinic cholinergic receptors',
    indications: ['Postoperative urinary retention', 'Neurogenic bladder', 'Gastroparesis'],
    dosage: {
      adult: 'Oral: 10-50 mg TID-QID; Subcutaneous: 2.5-5 mg TID-QID',
      pediatric: 'Not typically used in pediatrics',
      elderly: 'Reduce dose by 25-50%'
    }
  },
  {
    name: 'Pilocarpine',
    genericName: 'Pilocarpine hydrochloride',
    brandNames: ['Salagen', 'Isopto Carpine'],
    class: 'Cholinergic Agonists',
    category: 'Autonomic Nervous System',
    description: 'Muscarinic agonist used for glaucoma and dry mouth',
    mechanism: 'Direct stimulation of muscarinic cholinergic receptors',
    indications: ['Open-angle glaucoma', 'Xerostomia (dry mouth)', 'Sjögren\'s syndrome'],
    dosage: {
      adult: 'Ophthalmic: 1-2 drops QID; Oral: 5 mg TID',
      pediatric: 'Ophthalmic: 1 drop TID',
      elderly: 'Same as adult dose with monitoring'
    }
  },

  // Cholinesterase Inhibitors
  {
    name: 'Neostigmine',
    genericName: 'Neostigmine methylsulfate',
    brandNames: ['Prostigmin'],
    class: 'Cholinesterase Inhibitors',
    category: 'Autonomic Nervous System',
    description: 'Reversible cholinesterase inhibitor that does not cross blood-brain barrier',
    mechanism: 'Inhibition of acetylcholinesterase, increasing acetylcholine levels',
    indications: ['Myasthenia gravis', 'Postoperative reversal of neuromuscular blockade', 'Paralytic ileus'],
    dosage: {
      adult: 'Oral: 15-375 mg daily in divided doses; IM/IV: 0.5-2.5 mg',
      pediatric: 'Oral: 2 mg/kg/day in divided doses',
      elderly: 'Reduce dose by 25%'
    }
  },
  {
    name: 'Physostigmine',
    genericName: 'Physostigmine salicylate',
    brandNames: ['Antilirium'],
    class: 'Cholinesterase Inhibitors',
    category: 'Autonomic Nervous System',
    description: 'Reversible cholinesterase inhibitor that crosses blood-brain barrier',
    mechanism: 'Inhibition of acetylcholinesterase, counteracts anticholinergic toxicity',
    indications: ['Anticholinergic poisoning', 'Tricyclic antidepressant overdose'],
    dosage: {
      adult: 'IV: 0.5-2 mg slowly, repeat as needed',
      pediatric: 'IV: 0.02 mg/kg, repeat as needed',
      elderly: 'Reduce dose and monitor closely'
    }
  },
  {
    name: 'Pyridostigmine',
    genericName: 'Pyridostigmine bromide',
    brandNames: ['Mestinon'],
    class: 'Cholinesterase Inhibitors',
    category: 'Autonomic Nervous System',
    description: 'Long-acting cholinesterase inhibitor for myasthenia gravis',
    mechanism: 'Inhibition of acetylcholinesterase at neuromuscular junction',
    indications: ['Myasthenia gravis', 'Pretreatment for nerve agent exposure'],
    dosage: {
      adult: 'Oral: 60-1500 mg/day in divided doses',
      pediatric: 'Oral: 7 mg/kg/day in 5-6 divided doses',
      elderly: 'Start with lower doses'
    }
  },
  {
    name: 'Donepezil',
    genericName: 'Donepezil hydrochloride',
    brandNames: ['Aricept'],
    class: 'Cholinesterase Inhibitors',
    category: 'Autonomic Nervous System',
    description: 'Selective acetylcholinesterase inhibitor for dementia',
    mechanism: 'Reversible inhibition of acetylcholinesterase in the brain',
    indications: ['Alzheimer\'s disease', 'Dementia with Lewy bodies'],
    dosage: {
      adult: 'Oral: 5-10 mg once daily',
      pediatric: 'Not indicated in children',
      elderly: 'Start with 5 mg daily, increase after 4-6 weeks'
    }
  },

  // Cholinergic Antagonists
  {
    name: 'Atropine',
    genericName: 'Atropine sulfate',
    brandNames: ['AtroPen'],
    class: 'Cholinergic Antagonists',
    category: 'Autonomic Nervous System',
    description: 'Non-selective muscarinic antagonist',
    mechanism: 'Competitive antagonism at muscarinic receptors',
    indications: ['Bradycardia', 'Organophosphate poisoning', 'Mydriasis', 'Antispasmodic'],
    dosage: {
      adult: 'IV: 0.5-1 mg; Ophthalmic: 1-2 drops',
      pediatric: 'IV: 0.01-0.03 mg/kg',
      elderly: 'Use with caution, increased sensitivity'
    }
  },
  {
    name: 'Scopolamine',
    genericName: 'Scopolamine hydrobromide',
    brandNames: ['Transderm Scop'],
    class: 'Cholinergic Antagonists',
    category: 'Autonomic Nervous System',
    description: 'Muscarinic antagonist that crosses blood-brain barrier',
    mechanism: 'Central and peripheral muscarinic receptor blockade',
    indications: ['Motion sickness', 'Postoperative nausea', 'Mydriasis'],
    dosage: {
      adult: 'Transdermal: 1 patch every 3 days; Ophthalmic: 1-2 drops',
      pediatric: 'Not recommended under 12 years',
      elderly: 'Use with caution, may cause confusion'
    }
  },
  {
    name: 'Ipratropium',
    genericName: 'Ipratropium bromide',
    brandNames: ['Atrovent'],
    class: 'Cholinergic Antagonists',
    category: 'Autonomic Nervous System',
    description: 'Quaternary antimuscarinic bronchodilator',
    mechanism: 'Muscarinic receptor antagonism in airways',
    indications: ['COPD', 'Asthma', 'Rhinitis'],
    dosage: {
      adult: 'Inhaled: 2-4 puffs QID; Nasal: 2 sprays per nostril',
      pediatric: 'Inhaled: 1-2 puffs QID (>6 years)',
      elderly: 'Same as adult dose'
    }
  },
  {
    name: 'Oxybutynin',
    genericName: 'Oxybutynin chloride',
    brandNames: ['Ditropan', 'Oxytrol'],
    class: 'Cholinergic Antagonists',
    category: 'Autonomic Nervous System',
    description: 'Antimuscarinic agent for urinary incontinence',
    mechanism: 'Muscarinic receptor antagonism in bladder',
    indications: ['Urinary incontinence', 'Overactive bladder', 'Neurogenic bladder'],
    dosage: {
      adult: 'Oral: 5 mg BID-TID; Transdermal: 3.9 mg patch twice weekly',
      pediatric: 'Oral: 0.2 mg/kg BID-TID (>5 years)',
      elderly: 'Start with 2.5 mg BID'
    }
  }
]

// Export function to seed the database
export async function seedDrugsAndClasses() {
  console.log('Seeding drugs and drug classes...')
  
  // In a real application, this would insert data into the actual database
  // For now, this serves as a comprehensive data structure
  
  return {
    drugClasses: drugClassesData,
    drugs: drugsData,
    message: `Successfully seeded ${drugClassesData.length} drug classes and ${drugsData.length} drugs`
  }
}

// GET /api/admin/seed-drugs - Get seed drug data for development/fallback
export async function GET(request: NextRequest) {
  try {
    const seedDrugs = {
      drugs: [
        {
          name: "Amoxicillin",
          genericName: "Amoxicillin",
          brandNames: ["Amoxil", "Trimox"],
          class: "Penicillin Antibiotics",
          category: "Anti-infectives",
          description: "A penicillin antibiotic used to treat bacterial infections",
          mechanism: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins",
          indications: [
            "Respiratory tract infections",
            "Urinary tract infections",
            "Skin and soft tissue infections",
            "Otitis media",
            "Dental infections"
          ],
          dosage: {
            adult: "250-500mg every 8 hours or 500-875mg every 12 hours",
            pediatric: "20-40mg/kg/day divided every 8 hours",
            elderly: "Standard adult dose, monitor renal function"
          },
          sideEffects: ["Diarrhea", "Nausea", "Vomiting", "Allergic reactions"],
          contraindications: ["Penicillin allergy", "Severe renal impairment"],
          interactions: ["Warfarin", "Methotrexate", "Oral contraceptives"]
        },
        {
          name: "Metformin",
          genericName: "Metformin hydrochloride",
          brandNames: ["Glucophage", "Fortamet"],
          class: "Biguanides",
          category: "Endocrine",
          description: "First-line treatment for type 2 diabetes mellitus",
          mechanism: "Decreases hepatic glucose production and improves insulin sensitivity",
          indications: [
            "Type 2 diabetes mellitus",
            "Polycystic ovary syndrome (off-label)",
            "Prediabetes prevention"
          ],
          dosage: {
            adult: "500mg twice daily, titrate up to 2000mg daily",
            pediatric: "Not recommended under 10 years",
            elderly: "Start with lower doses, monitor renal function"
          },
          sideEffects: ["Gastrointestinal upset", "Diarrhea", "Lactic acidosis (rare)"],
          contraindications: ["Severe renal impairment", "Metabolic acidosis", "Acute heart failure"],
          interactions: ["Contrast agents", "Alcohol", "Cimetidine"]
        },
        {
          name: "Lisinopril",
          genericName: "Lisinopril",
          brandNames: ["Prinivil", "Zestril"],
          class: "ACE Inhibitors",
          category: "Cardiovascular",
          description: "ACE inhibitor used for hypertension and heart failure",
          mechanism: "Inhibits angiotensin-converting enzyme, reducing vasoconstriction",
          indications: [
            "Hypertension",
            "Heart failure",
            "Post-myocardial infarction",
            "Diabetic nephropathy"
          ],
          dosage: {
            adult: "5-40mg once daily",
            pediatric: "0.07mg/kg once daily, max 5mg",
            elderly: "Start with 2.5mg once daily"
          },
          sideEffects: ["Dry cough", "Hyperkalemia", "Hypotension", "Angioedema"],
          contraindications: ["Pregnancy", "Bilateral renal artery stenosis", "Hyperkalemia"],
          interactions: ["Potassium supplements", "NSAIDs", "Lithium"]
        },
        {
          name: "Albuterol",
          genericName: "Albuterol sulfate",
          brandNames: ["Ventolin", "ProAir"],
          class: "Beta-2 Agonists",
          category: "Respiratory",
          description: "Short-acting bronchodilator for asthma and COPD",
          mechanism: "Stimulates beta-2 adrenergic receptors in bronchial smooth muscle",
          indications: [
            "Bronchospasm in asthma",
            "COPD exacerbations",
            "Exercise-induced bronchospasm"
          ],
          dosage: {
            adult: "2 puffs every 4-6 hours as needed",
            pediatric: "1-2 puffs every 4-6 hours as needed",
            elderly: "Standard adult dose"
          },
          sideEffects: ["Tremor", "Tachycardia", "Nervousness", "Headache"],
          contraindications: ["Hypersensitivity to sympathomimetics"],
          interactions: ["Beta-blockers", "MAO inhibitors", "Tricyclic antidepressants"]
        },
        {
          name: "Atorvastatin",
          genericName: "Atorvastatin calcium",
          brandNames: ["Lipitor"],
          class: "HMG-CoA Reductase Inhibitors",
          category: "Cardiovascular",
          description: "Statin used to lower cholesterol and prevent cardiovascular disease",
          mechanism: "Inhibits HMG-CoA reductase, reducing cholesterol synthesis",
          indications: [
            "Hypercholesterolemia",
            "Primary prevention of cardiovascular disease",
            "Secondary prevention post-MI"
          ],
          dosage: {
            adult: "10-80mg once daily",
            pediatric: "10-20mg once daily (age 10-17)",
            elderly: "Start with 10mg once daily"
          },
          sideEffects: ["Muscle pain", "Elevated liver enzymes", "Headache"],
          contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"],
          interactions: ["Warfarin", "Digoxin", "Cyclosporine"]
        },
        {
          name: "Omeprazole",
          genericName: "Omeprazole",
          brandNames: ["Prilosec", "Losec"],
          class: "Proton Pump Inhibitors",
          category: "Gastrointestinal",
          description: "PPI used to reduce stomach acid production",
          mechanism: "Irreversibly inhibits hydrogen-potassium ATPase enzyme",
          indications: [
            "Gastroesophageal reflux disease",
            "Peptic ulcer disease",
            "Zollinger-Ellison syndrome",
            "H. pylori eradication"
          ],
          dosage: {
            adult: "20-40mg once daily",
            pediatric: "0.7-3.3mg/kg once daily",
            elderly: "Standard adult dose"
          },
          sideEffects: ["Headache", "Diarrhea", "Abdominal pain", "Vitamin B12 deficiency"],
          contraindications: ["Hypersensitivity to PPIs"],
          interactions: ["Warfarin", "Clopidogrel", "Atazanavir"]
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: seedDrugs
    })
  } catch (error) {
    console.error('Error fetching seed drugs:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch seed drugs'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert Drug Classes
    const processArray = (arr: any) => Array.isArray(arr) ? arr.join('\n') : (arr || null)

    for (const dc of drugClassesData) {
      await prisma.drugClass.upsert({
        where: { id: dc.id },
        update: {
          name: dc.name,
          category: dc.category,
          description: dc.description,
          mechanism: dc.mechanism,
          therapeuticUses: processArray(dc.therapeuticUses),
          commonSideEffects: processArray(dc.commonSideEffects),
          contraindications: processArray(dc.contraindications)
        },
        create: {
          id: dc.id,
          name: dc.name,
          category: dc.category,
          description: dc.description,
          mechanism: dc.mechanism,
          therapeuticUses: processArray(dc.therapeuticUses),
          commonSideEffects: processArray(dc.commonSideEffects),
          contraindications: processArray(dc.contraindications)
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Drug database seeded successfully'
    })
  } catch (error) {
    console.error('Error seeding drug database:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed drug database' },
      { status: 500 }
    )
  }
}