/**
 * Generate Accurate Occupation Metadata
 *
 * This script replaces the naive SOC-major-group-only approach with
 * per-occupation metadata generated from:
 *   1. SOC sub-group (4-digit) specific defaults
 *   2. Title-keyword refinements for individual roles
 *   3. Education-level informed adjustments
 *   4. Rich keywords, certifications, and descriptions
 *
 * Run: npx tsx scripts/generate-occupation-metadata.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Occupation, OccupationMetadata } from '../src/types/wages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CareerCluster = OccupationMetadata['careerCluster'];

// ─── Sub-group metadata templates (SOC 2-digit + 4-digit) ──────────────────
// Each sub-group gets a specialized template. Title keywords further refine.

const SUB_GROUP_TEMPLATES: Record<string, Partial<OccupationMetadata>> = {
  // ── 11: Management ──────────────────────────────────────────────
  '11-10': { // Top Executives
    careerCluster: 'business', secondaryClusters: ['law'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'frequent' },
    skills: { analytical: 9, creative: 7, social: 10, technical: 5, leadership: 10, physical: 1, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'financial_security', 'advancement', 'prestige'],
    outlook: { growth: 'stable', automationRisk: 'low' },
    keywords: ['executive leadership', 'strategic planning', 'organizational management', 'decision-making', 'corporate governance'],
  },
  '11-20': { // Advertising, Marketing, Promotions, PR, Sales Managers
    careerCluster: 'business', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 8, creative: 9, social: 9, technical: 5, leadership: 9, physical: 1, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'creativity', 'financial_security', 'advancement'],
    outlook: { growth: 'growing', automationRisk: 'low' },
    keywords: ['marketing strategy', 'advertising', 'brand management', 'campaign planning', 'market analysis', 'sales management'],
  },
  '11-30': { // Operations Specialty Managers
    careerCluster: 'business', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 9, creative: 6, social: 8, technical: 7, leadership: 9, physical: 1, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'financial_security', 'problem_solving', 'advancement'],
    outlook: { growth: 'growing', automationRisk: 'low' },
    keywords: ['operations management', 'business operations', 'process improvement', 'strategic planning', 'budgeting'],
  },
  '11-90': { // Other Management
    careerCluster: 'business',
    workEnvironment: { setting: ['office', 'field'], schedule: ['standard', 'flexible'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 8, creative: 6, social: 8, technical: 6, leadership: 9, physical: 2, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'financial_security', 'advancement'],
    outlook: { growth: 'growing', automationRisk: 'low' },
    keywords: ['management', 'supervision', 'operations', 'planning', 'coordination'],
  },

  // ── 13: Business & Financial Operations ────────────────────────
  '13-10': { // Business Operations Specialists
    careerCluster: 'business', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 8, creative: 6, social: 7, technical: 6, leadership: 5, physical: 1, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'financial_security', 'stability'],
    outlook: { growth: 'growing', automationRisk: 'medium' },
    keywords: ['business analysis', 'project coordination', 'operations planning', 'reporting', 'consulting'],
  },
  '13-20': { // Financial Specialists
    careerCluster: 'business',
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 10, creative: 4, social: 6, technical: 7, leadership: 5, physical: 1, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['financial_security', 'problem_solving', 'stability'],
    outlook: { growth: 'growing', automationRisk: 'medium' },
    keywords: ['financial analysis', 'accounting', 'budgeting', 'tax', 'financial planning', 'compliance'],
  },

  // ── 15: Computer & Mathematical ────────────────────────────────
  '15-10': { // Computer Occupations - broad
    careerCluster: 'stem', secondaryClusters: ['business'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 9, creative: 7, social: 4, technical: 10, leadership: 4, physical: 1, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'innovation', 'financial_security', 'independence'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
  },
  '15-12': { // Computer Occupations - analysts, scientists, security
    careerCluster: 'stem', secondaryClusters: ['business'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 10, creative: 7, social: 5, technical: 10, leadership: 5, physical: 1, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'innovation', 'financial_security', 'independence'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
  },
  '15-13': { // Software Developers, Programmers, Testers
    careerCluster: 'stem', secondaryClusters: ['business'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 10, creative: 8, social: 4, technical: 10, leadership: 4, physical: 1, detail: 9 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'innovation', 'financial_security', 'independence'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
  },
  '15-14': { // Database & Network Admins, Architects
    careerCluster: 'stem', secondaryClusters: ['business'],
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'oncall'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 9, creative: 5, social: 5, technical: 10, leadership: 5, physical: 1, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'financial_security', 'stability', 'independence'],
    outlook: { growth: 'growing', automationRisk: 'medium' },
    keywords: ['database management', 'network administration', 'system architecture', 'infrastructure', 'server management'],
  },
  '15-20': { // Mathematical Science
    careerCluster: 'stem',
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 10, creative: 6, social: 4, technical: 8, leadership: 3, physical: 1, detail: 10 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'innovation', 'independence'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'medium' },
    keywords: ['mathematics', 'statistical analysis', 'modeling', 'algorithms', 'quantitative research'],
  },

  // ── 17: Architecture & Engineering ─────────────────────────────
  '17-10': { // Architects, Surveyors, Cartographers
    careerCluster: 'stem', secondaryClusters: ['arts'],
    workEnvironment: { setting: ['office', 'field'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 8, creative: 10, social: 6, technical: 9, leadership: 5, physical: 3, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'moderate' },
    values: ['creativity', 'problem_solving', 'innovation'],
    outlook: { growth: 'stable', automationRisk: 'low' },
    keywords: ['architectural design', 'drafting', 'building design', 'surveying', 'land measurement'],
  },
  '17-20': { // Engineers
    careerCluster: 'stem',
    workEnvironment: { setting: ['office', 'laboratory', 'field'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 10, creative: 8, social: 5, technical: 10, leadership: 5, physical: 3, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'moderate', pace: 'methodical', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'innovation', 'financial_security'],
    outlook: { growth: 'growing', automationRisk: 'low' },
    keywords: ['engineering design', 'technical analysis', 'problem solving', 'project engineering', 'specifications'],
  },
  '17-30': { // Drafters, Engineering Technicians, Mapping Technicians
    careerCluster: 'stem', secondaryClusters: ['trades'],
    workEnvironment: { setting: ['office', 'field'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 8, creative: 7, social: 4, technical: 9, leadership: 3, physical: 3, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'stability', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
    keywords: ['technical drafting', 'cad', 'blueprint reading', 'technical documentation', 'engineering support'],
  },

  // ── 19: Life, Physical, Social Science ─────────────────────────
  '19-10': { // Life Scientists (biologists, food scientists, etc)
    careerCluster: 'stem', secondaryClusters: ['healthcare'],
    workEnvironment: { setting: ['laboratory', 'field', 'office'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 10, creative: 7, social: 4, technical: 8, leadership: 4, physical: 4, detail: 10 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'innovation', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
    keywords: ['biological research', 'laboratory work', 'scientific method', 'data collection', 'experimentation'],
  },
  '19-20': { // Physical Scientists (chemistry, physics, atmospheric, etc)
    careerCluster: 'stem',
    workEnvironment: { setting: ['laboratory', 'office', 'field'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 10, creative: 8, social: 4, technical: 9, leadership: 4, physical: 3, detail: 10 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'innovation', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'low' },
    keywords: ['physical science', 'laboratory analysis', 'research', 'experimentation', 'scientific measurement'],
  },
  '19-30': { // Social Scientists (economists, psychologists, sociologists)
    careerCluster: 'socialServices', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['office', 'field'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 10, creative: 7, social: 8, technical: 5, leadership: 5, physical: 1, detail: 9 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'methodical', peopleInteraction: 'moderate' },
    values: ['problem_solving', 'helping_others', 'innovation'],
    outlook: { growth: 'growing', automationRisk: 'low' },
    keywords: ['social research', 'data analysis', 'behavioral science', 'survey research', 'policy analysis'],
  },
  '19-40': { // Life, Physical, Social Science Technicians
    careerCluster: 'stem',
    workEnvironment: { setting: ['laboratory', 'field'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 7, creative: 4, social: 4, technical: 8, leadership: 3, physical: 5, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
    keywords: ['laboratory support', 'sample preparation', 'testing', 'data recording', 'equipment calibration'],
  },

  // ── 21: Community & Social Service ─────────────────────────────
  '21-10': { // Counselors, Social Workers, Community Service Specialists
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['office', 'field', 'school'], schedule: ['standard', 'flexible'], physicalDemands: 'light', travelRequired: 'frequent' },
    skills: { analytical: 6, creative: 5, social: 10, technical: 3, leadership: 6, physical: 2, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'variety'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
    keywords: ['counseling', 'case management', 'client assessment', 'community resources', 'crisis intervention', 'advocacy'],
  },
  '21-20': { // Religious Workers
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['office', 'field'], schedule: ['flexible', 'weekend'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 5, creative: 6, social: 10, technical: 2, leadership: 8, physical: 2, detail: 5 },
    workStyle: { independence: 'mixed', structure: 'flexible', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'leadership'],
    outlook: { growth: 'stable', automationRisk: 'low' },
    keywords: ['religious ministry', 'pastoral care', 'community outreach', 'spiritual guidance', 'worship'],
  },

  // ── 23: Legal ──────────────────────────────────────────────────
  '23-10': { // Lawyers, Judges, Magistrates
    careerCluster: 'law',
    workEnvironment: { setting: ['office'], schedule: ['standard', 'flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 10, creative: 7, social: 9, technical: 5, leadership: 8, physical: 1, detail: 10 },
    workStyle: { independence: 'independent', structure: 'highly_structured', variety: 'moderate', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['prestige', 'financial_security', 'service', 'problem_solving'],
    outlook: { growth: 'stable', automationRisk: 'low' },
    keywords: ['legal practice', 'case law', 'litigation', 'legal analysis', 'courtroom proceedings'],
  },
  '23-20': { // Legal Support Workers
    careerCluster: 'law', secondaryClusters: ['business'],
    workEnvironment: { setting: ['office'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 8, creative: 4, social: 6, technical: 6, leadership: 3, physical: 1, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['stability', 'problem_solving', 'service'],
    outlook: { growth: 'growing', automationRisk: 'medium' },
    keywords: ['legal research', 'document preparation', 'case management', 'legal support', 'filing'],
  },

  // ── 25: Education ──────────────────────────────────────────────
  '25-10': { // Postsecondary Teachers
    careerCluster: 'socialServices', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['school', 'office', 'laboratory'], schedule: ['flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 9, creative: 8, social: 9, technical: 6, leadership: 7, physical: 1, detail: 7 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'independence', 'innovation', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '25-11': { // Postsecondary Teachers - specific subjects
    careerCluster: 'socialServices', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['school', 'office', 'laboratory'], schedule: ['flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 9, creative: 8, social: 9, technical: 6, leadership: 7, physical: 1, detail: 7 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'independence', 'innovation', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '25-20': { // Primary, Secondary, Special Ed Teachers
    careerCluster: 'socialServices', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['school'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 6, creative: 8, social: 10, technical: 5, leadership: 7, physical: 4, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'work_life_balance', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
    keywords: ['classroom teaching', 'lesson planning', 'student assessment', 'curriculum delivery', 'student development'],
  },
  '25-30': { // Other Teachers & Instructors
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['school', 'office'], schedule: ['flexible'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 6, creative: 8, social: 9, technical: 5, leadership: 6, physical: 3, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'creativity'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '25-40': { // Librarians, Curators, Archivists
    careerCluster: 'socialServices', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['office', 'school'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 8, creative: 6, social: 7, technical: 6, leadership: 4, physical: 2, detail: 9 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'moderate' },
    values: ['service', 'independence', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '25-90': { // Other Educational Instruction
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['school', 'office'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 5, creative: 6, social: 8, technical: 4, leadership: 4, physical: 3, detail: 6 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'routine', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },

  // ── 27: Arts, Design, Entertainment, Sports, Media ─────────────
  '27-10': { // Art & Design Workers
    careerCluster: 'arts',
    workEnvironment: { setting: ['office', 'remote'], schedule: ['flexible'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 5, creative: 10, social: 5, technical: 7, leadership: 4, physical: 2, detail: 9 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['creativity', 'independence', 'innovation'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '27-20': { // Entertainers, Performers, Athletes
    careerCluster: 'arts', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['field', 'office'], schedule: ['flexible', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'frequent' },
    skills: { analytical: 4, creative: 10, social: 8, technical: 4, leadership: 5, physical: 7, detail: 5 },
    workStyle: { independence: 'mixed', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['creativity', 'variety', 'independence', 'prestige'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '27-30': { // Media & Communication Workers
    careerCluster: 'communication', secondaryClusters: ['arts'],
    workEnvironment: { setting: ['office', 'remote', 'field'], schedule: ['flexible'], physicalDemands: 'sedentary', travelRequired: 'occasional' },
    skills: { analytical: 7, creative: 9, social: 8, technical: 6, leadership: 4, physical: 1, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['creativity', 'variety', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '27-40': { // Media & Communication Equipment Workers
    careerCluster: 'arts', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['office', 'field'], schedule: ['flexible', 'evening', 'weekend'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 6, creative: 8, social: 4, technical: 9, leadership: 3, physical: 4, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['creativity', 'independence', 'innovation'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },

  // ── 29: Healthcare Practitioners ───────────────────────────────
  '29-10': { // Health Diagnosing & Treating Practitioners (doctors, dentists, etc)
    careerCluster: 'healthcare',
    workEnvironment: { setting: ['hospital', 'office'], schedule: ['standard', 'oncall'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 10, creative: 5, social: 9, technical: 9, leadership: 7, physical: 5, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['helping_others', 'financial_security', 'prestige', 'service'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
  },
  '29-11': { // Therapists (OT, PT, Speech, etc)
    careerCluster: 'healthcare', secondaryClusters: ['socialServices'],
    workEnvironment: { setting: ['hospital', 'office', 'school'], schedule: ['standard', 'flexible'], physicalDemands: 'medium', travelRequired: 'occasional' },
    skills: { analytical: 8, creative: 7, social: 10, technical: 7, leadership: 5, physical: 6, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'work_life_balance'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
  },
  '29-12': { // Physicians (specific specialties)
    careerCluster: 'healthcare',
    workEnvironment: { setting: ['hospital', 'office'], schedule: ['shift', 'oncall'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 10, creative: 5, social: 9, technical: 10, leadership: 7, physical: 5, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['helping_others', 'financial_security', 'prestige', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '29-20': { // Health Technologists & Technicians
    careerCluster: 'healthcare', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['hospital', 'laboratory'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 7, creative: 3, social: 6, technical: 9, leadership: 3, physical: 5, detail: 9 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['helping_others', 'stability', 'service'],
    outlook: { growth: 'growing', automationRisk: 'medium' },
  },
  '29-90': { // Other Healthcare Practitioners
    careerCluster: 'healthcare',
    workEnvironment: { setting: ['hospital', 'office'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 7, creative: 4, social: 7, technical: 7, leadership: 4, physical: 4, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['helping_others', 'stability', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },

  // ── 31: Healthcare Support ─────────────────────────────────────
  '31-10': { // Nursing Assistants, Orderlies, Home Health Aides
    careerCluster: 'healthcare',
    workEnvironment: { setting: ['hospital', 'home'], schedule: ['shift', 'oncall'], physicalDemands: 'heavy', travelRequired: 'occasional' },
    skills: { analytical: 4, creative: 2, social: 9, technical: 5, leadership: 2, physical: 8, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'stability'],
    outlook: { growth: 'much_faster_than_average', automationRisk: 'low' },
  },
  '31-20': { // Other Healthcare Support (dental assistants, medical assistants, etc)
    careerCluster: 'healthcare',
    workEnvironment: { setting: ['hospital', 'office'], schedule: ['standard', 'shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 5, creative: 3, social: 8, technical: 6, leadership: 3, physical: 6, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'stability'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '31-90': { // Other Healthcare Support
    careerCluster: 'healthcare',
    workEnvironment: { setting: ['hospital', 'office'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 4, creative: 2, social: 8, technical: 5, leadership: 2, physical: 7, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },

  // ── 33: Protective Service ─────────────────────────────────────
  '33-10': { // Supervisors of Protective Service Workers
    careerCluster: 'law', secondaryClusters: ['socialServices'],
    workEnvironment: { setting: ['office', 'field'], schedule: ['shift', 'oncall'], physicalDemands: 'medium', travelRequired: 'occasional' },
    skills: { analytical: 7, creative: 4, social: 8, technical: 6, leadership: 9, physical: 6, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'service', 'helping_others', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '33-20': { // Fire Fighting & Prevention
    careerCluster: 'socialServices', secondaryClusters: ['trades'],
    workEnvironment: { setting: ['field', 'outdoor'], schedule: ['shift', 'oncall'], physicalDemands: 'veryHeavy', travelRequired: 'frequent' },
    skills: { analytical: 6, creative: 4, social: 7, technical: 7, leadership: 6, physical: 10, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['helping_others', 'service', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '33-30': { // Law Enforcement
    careerCluster: 'law', secondaryClusters: ['socialServices'],
    workEnvironment: { setting: ['field', 'office'], schedule: ['shift', 'oncall'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 7, creative: 4, social: 8, technical: 6, leadership: 7, physical: 9, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['service', 'helping_others', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '33-90': { // Other Protective Service (guards, crossing guards, etc)
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['field', 'office', 'retail'], schedule: ['shift', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 4, creative: 2, social: 6, technical: 4, leadership: 3, physical: 7, detail: 7 },
    workStyle: { independence: 'independent', structure: 'highly_structured', variety: 'routine', pace: 'methodical', peopleInteraction: 'moderate' },
    values: ['stability', 'service'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },

  // ── 35: Food Preparation & Serving ─────────────────────────────
  '35-10': { // Supervisors of Food Preparation & Serving
    careerCluster: 'business', secondaryClusters: ['arts'],
    workEnvironment: { setting: ['retail'], schedule: ['shift', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 5, creative: 6, social: 8, technical: 5, leadership: 8, physical: 6, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'variety'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '35-20': { // Cooks & Food Preparation
    careerCluster: 'arts', secondaryClusters: ['trades'],
    workEnvironment: { setting: ['retail'], schedule: ['shift', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 3, creative: 7, social: 5, technical: 5, leadership: 3, physical: 8, detail: 7 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'routine', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['creativity', 'variety'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '35-30': { // Food & Beverage Serving
    careerCluster: 'business',
    workEnvironment: { setting: ['retail'], schedule: ['shift', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 2, creative: 3, social: 9, technical: 2, leadership: 2, physical: 7, detail: 5 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'routine', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['variety', 'work_life_balance'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '35-90': { // Other Food Preparation & Serving
    careerCluster: 'business',
    workEnvironment: { setting: ['retail'], schedule: ['shift', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 2, creative: 3, social: 7, technical: 2, leadership: 2, physical: 7, detail: 5 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'routine', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['work_life_balance'],
    outlook: { growth: 'stable', automationRisk: 'high' },
  },

  // ── 37: Building & Grounds Cleaning and Maintenance ────────────
  '37-10': { // Supervisors
    careerCluster: 'trades',
    workEnvironment: { setting: ['field', 'outdoor'], schedule: ['standard'], physicalDemands: 'medium', travelRequired: 'frequent' },
    skills: { analytical: 5, creative: 4, social: 7, technical: 6, leadership: 8, physical: 6, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['leadership', 'stability', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '37-20': { // Building Cleaning Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['field', 'office'], schedule: ['standard', 'shift'], physicalDemands: 'heavy', travelRequired: 'none' },
    skills: { analytical: 3, creative: 2, social: 3, technical: 4, leadership: 2, physical: 9, detail: 6 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'routine', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['independence', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '37-30': { // Grounds Maintenance Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 3, creative: 5, social: 3, technical: 5, leadership: 3, physical: 10, detail: 5 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['independence', 'work_life_balance'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },

  // ── 39: Personal Care & Service ────────────────────────────────
  '39-10': { // Supervisors of Personal Care & Service
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['office', 'retail'], schedule: ['flexible'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 5, creative: 5, social: 9, technical: 4, leadership: 8, physical: 3, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['leadership', 'helping_others', 'variety'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '39-20': { // Animal Care & Service
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['field', 'outdoor'], schedule: ['flexible', 'weekend'], physicalDemands: 'medium', travelRequired: 'occasional' },
    skills: { analytical: 4, creative: 4, social: 6, technical: 5, leadership: 3, physical: 7, detail: 6 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['independence', 'helping_others', 'variety'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '39-30': { // Entertainment Attendants & Related
    careerCluster: 'arts', secondaryClusters: ['socialServices'],
    workEnvironment: { setting: ['field', 'retail'], schedule: ['flexible', 'evening', 'weekend'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 3, creative: 5, social: 8, technical: 3, leadership: 3, physical: 5, detail: 5 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['variety', 'work_life_balance'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '39-40': { // Funeral Service Workers
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['office', 'field'], schedule: ['flexible', 'oncall'], physicalDemands: 'medium', travelRequired: 'occasional' },
    skills: { analytical: 5, creative: 4, social: 10, technical: 4, leadership: 5, physical: 5, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'moderate', pace: 'methodical', peopleInteraction: 'extensive' },
    values: ['service', 'helping_others'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '39-50': { // Personal Appearance Workers
    careerCluster: 'arts', secondaryClusters: ['business'],
    workEnvironment: { setting: ['retail'], schedule: ['flexible'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 3, creative: 9, social: 9, technical: 5, leadership: 3, physical: 4, detail: 8 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['creativity', 'independence', 'variety'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '39-60': { // Transportation, Tourism, & Lodging Attendants
    careerCluster: 'business',
    workEnvironment: { setting: ['field', 'retail'], schedule: ['shift', 'evening', 'weekend'], physicalDemands: 'medium', travelRequired: 'occasional' },
    skills: { analytical: 3, creative: 3, social: 8, technical: 3, leadership: 2, physical: 5, detail: 5 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['variety', 'work_life_balance'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '39-70': { // Tour & Travel Guides
    careerCluster: 'communication', secondaryClusters: ['socialServices'],
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['flexible', 'weekend'], physicalDemands: 'light', travelRequired: 'frequent' },
    skills: { analytical: 4, creative: 6, social: 10, technical: 3, leadership: 5, physical: 5, detail: 5 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['variety', 'independence', 'service'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '39-90': { // Other Personal Care
    careerCluster: 'socialServices',
    workEnvironment: { setting: ['home', 'office'], schedule: ['flexible'], physicalDemands: 'medium', travelRequired: 'occasional' },
    skills: { analytical: 3, creative: 4, social: 8, technical: 3, leadership: 2, physical: 6, detail: 5 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['helping_others', 'independence'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },

  // ── 41: Sales ──────────────────────────────────────────────────
  '41-10': { // Supervisors of Sales Workers
    careerCluster: 'business', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['retail', 'office'], schedule: ['flexible', 'weekend'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 6, creative: 6, social: 10, technical: 4, leadership: 9, physical: 3, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'financial_security', 'variety'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '41-20': { // Retail Sales Workers
    careerCluster: 'business',
    workEnvironment: { setting: ['retail'], schedule: ['flexible', 'evening', 'weekend'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 3, creative: 4, social: 9, technical: 3, leadership: 2, physical: 4, detail: 5 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'routine', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['variety', 'work_life_balance'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '41-30': { // Sales Representatives, Services
    careerCluster: 'business', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['office', 'remote', 'field'], schedule: ['flexible'], physicalDemands: 'sedentary', travelRequired: 'frequent' },
    skills: { analytical: 7, creative: 7, social: 10, technical: 5, leadership: 5, physical: 2, detail: 6 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['financial_security', 'independence', 'variety'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '41-40': { // Sales Representatives, Wholesale/Manufacturing
    careerCluster: 'business', secondaryClusters: ['communication'],
    workEnvironment: { setting: ['office', 'field'], schedule: ['flexible'], physicalDemands: 'light', travelRequired: 'frequent' },
    skills: { analytical: 7, creative: 6, social: 10, technical: 6, leadership: 5, physical: 3, detail: 6 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['financial_security', 'independence', 'variety'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '41-90': { // Other Sales & Related
    careerCluster: 'business',
    workEnvironment: { setting: ['office', 'remote', 'field'], schedule: ['flexible'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 6, creative: 5, social: 9, technical: 4, leadership: 4, physical: 3, detail: 6 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['financial_security', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },

  // ── 43: Office & Administrative Support ────────────────────────
  '43-10': { // Supervisors of Office & Admin
    careerCluster: 'business',
    workEnvironment: { setting: ['office'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 6, creative: 4, social: 8, technical: 6, leadership: 8, physical: 1, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'extensive' },
    values: ['leadership', 'stability', 'work_life_balance'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '43-20': { // Communications Equipment Operators
    careerCluster: 'business',
    workEnvironment: { setting: ['office'], schedule: ['shift'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 4, creative: 2, social: 7, technical: 5, leadership: 2, physical: 1, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['stability'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '43-30': { // Financial Clerks
    careerCluster: 'business',
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 7, creative: 2, social: 5, technical: 6, leadership: 2, physical: 1, detail: 10 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['stability', 'financial_security'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '43-40': { // Information & Record Clerks
    careerCluster: 'business',
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 5, creative: 2, social: 7, technical: 6, leadership: 2, physical: 1, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['stability', 'work_life_balance'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '43-50': { // Material Recording, Scheduling, Dispatching
    careerCluster: 'business', secondaryClusters: ['trades'],
    workEnvironment: { setting: ['office', 'warehouse'], schedule: ['standard', 'shift'], physicalDemands: 'light', travelRequired: 'none' },
    skills: { analytical: 6, creative: 2, social: 6, technical: 6, leadership: 3, physical: 3, detail: 9 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['stability'],
    outlook: { growth: 'stable', automationRisk: 'high' },
  },
  '43-60': { // Secretaries & Administrative Assistants
    careerCluster: 'business',
    workEnvironment: { setting: ['office', 'remote'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 5, creative: 4, social: 7, technical: 7, leadership: 3, physical: 1, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['stability', 'work_life_balance'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '43-90': { // Other Office & Admin Support
    careerCluster: 'business',
    workEnvironment: { setting: ['office'], schedule: ['standard'], physicalDemands: 'sedentary', travelRequired: 'none' },
    skills: { analytical: 5, creative: 3, social: 5, technical: 5, leadership: 2, physical: 2, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability', 'work_life_balance'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },

  // ── 45: Farming, Fishing, Forestry ─────────────────────────────
  '45-10': { // Supervisors
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 6, creative: 4, social: 7, technical: 7, leadership: 8, physical: 8, detail: 6 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['leadership', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '45-20': { // Agricultural Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'veryHeavy', travelRequired: 'none' },
    skills: { analytical: 4, creative: 3, social: 3, technical: 5, leadership: 2, physical: 10, detail: 5 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['independence'],
    outlook: { growth: 'declining', automationRisk: 'medium' },
  },
  '45-30': { // Fishing & Hunting Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor'], schedule: ['flexible'], physicalDemands: 'veryHeavy', travelRequired: 'frequent' },
    skills: { analytical: 5, creative: 3, social: 3, technical: 5, leadership: 3, physical: 10, detail: 6 },
    workStyle: { independence: 'independent', structure: 'flexible', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['independence', 'variety'],
    outlook: { growth: 'declining', automationRisk: 'low' },
  },
  '45-40': { // Forest, Conservation & Logging Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'veryHeavy', travelRequired: 'frequent' },
    skills: { analytical: 5, creative: 3, social: 3, technical: 6, leadership: 3, physical: 10, detail: 6 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['independence'],
    outlook: { growth: 'declining', automationRisk: 'medium' },
  },

  // ── 47: Construction & Extraction ──────────────────────────────
  '47-10': { // Supervisors of Construction & Extraction
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'medium', travelRequired: 'frequent' },
    skills: { analytical: 7, creative: 5, social: 8, technical: 8, leadership: 9, physical: 6, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'financial_security', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '47-20': { // Construction Trades Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'veryHeavy', travelRequired: 'frequent' },
    skills: { analytical: 6, creative: 5, social: 5, technical: 9, leadership: 4, physical: 10, detail: 8 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['financial_security', 'independence'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '47-21': { // Electricians, Glaziers, Insulation Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['field', 'outdoor'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 7, creative: 5, social: 5, technical: 9, leadership: 4, physical: 9, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['financial_security', 'independence', 'problem_solving'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '47-30': { // Helpers, Construction Trades
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 3, creative: 3, social: 4, technical: 5, leadership: 2, physical: 10, detail: 5 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '47-40': { // Other Construction & Related
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 5, creative: 4, social: 4, technical: 7, leadership: 3, physical: 9, detail: 7 },
    workStyle: { independence: 'team', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['independence', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '47-50': { // Extraction Workers (oil, gas, mining)
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['shift'], physicalDemands: 'veryHeavy', travelRequired: 'frequent' },
    skills: { analytical: 5, creative: 3, social: 4, technical: 8, leadership: 3, physical: 10, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['financial_security', 'stability'],
    outlook: { growth: 'declining', automationRisk: 'medium' },
  },

  // ── 49: Installation, Maintenance, Repair ──────────────────────
  '49-10': { // Supervisors
    careerCluster: 'trades',
    workEnvironment: { setting: ['field', 'warehouse'], schedule: ['standard', 'oncall'], physicalDemands: 'medium', travelRequired: 'frequent' },
    skills: { analytical: 7, creative: 5, social: 8, technical: 9, leadership: 9, physical: 5, detail: 8 },
    workStyle: { independence: 'mixed', structure: 'moderate', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['leadership', 'problem_solving', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '49-20': { // Electrical & Electronic Equipment Mechanics, Installers, Repairers
    careerCluster: 'trades', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['field', 'office'], schedule: ['standard', 'oncall'], physicalDemands: 'medium', travelRequired: 'frequent' },
    skills: { analytical: 8, creative: 5, social: 4, technical: 10, leadership: 3, physical: 6, detail: 9 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'independence', 'stability'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '49-30': { // Vehicle & Mobile Equipment Mechanics, Installers, Repairers
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse', 'field'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'occasional' },
    skills: { analytical: 7, creative: 4, social: 4, technical: 9, leadership: 3, physical: 8, detail: 9 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['problem_solving', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '49-90': { // Other Installation, Maintenance, Repair
    careerCluster: 'trades',
    workEnvironment: { setting: ['field', 'warehouse', 'outdoor'], schedule: ['standard', 'oncall'], physicalDemands: 'heavy', travelRequired: 'frequent' },
    skills: { analytical: 6, creative: 4, social: 4, technical: 8, leadership: 3, physical: 8, detail: 8 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'high_variety', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['independence', 'problem_solving', 'variety'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },

  // ── 51: Production ─────────────────────────────────────────────
  '51-10': { // Supervisors of Production Workers
    careerCluster: 'trades', secondaryClusters: ['business'],
    workEnvironment: { setting: ['warehouse'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 6, creative: 4, social: 8, technical: 7, leadership: 9, physical: 5, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'moderate', pace: 'fast_paced', peopleInteraction: 'extensive' },
    values: ['leadership', 'stability', 'financial_security'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '51-20': { // Assemblers & Fabricators
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 4, creative: 3, social: 3, technical: 7, leadership: 2, physical: 7, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '51-30': { // Food Processing Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 3, creative: 3, social: 3, technical: 5, leadership: 2, physical: 7, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'stable', automationRisk: 'high' },
  },
  '51-40': { // Metal Workers & Plastic Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse'], schedule: ['shift'], physicalDemands: 'heavy', travelRequired: 'none' },
    skills: { analytical: 5, creative: 4, social: 3, technical: 8, leadership: 2, physical: 8, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability', 'financial_security'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '51-50': { // Printing Workers
    careerCluster: 'trades', secondaryClusters: ['arts'],
    workEnvironment: { setting: ['warehouse', 'office'], schedule: ['standard', 'shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 4, creative: 5, social: 3, technical: 7, leadership: 2, physical: 5, detail: 9 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '51-60': { // Textile, Apparel, Furnishings Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse'], schedule: ['standard', 'shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 3, creative: 5, social: 3, technical: 6, leadership: 2, physical: 6, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '51-70': { // Woodworkers
    careerCluster: 'trades', secondaryClusters: ['arts'],
    workEnvironment: { setting: ['warehouse'], schedule: ['standard'], physicalDemands: 'heavy', travelRequired: 'none' },
    skills: { analytical: 5, creative: 7, social: 3, technical: 8, leadership: 2, physical: 8, detail: 8 },
    workStyle: { independence: 'independent', structure: 'moderate', variety: 'moderate', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['independence', 'creativity'],
    outlook: { growth: 'declining', automationRisk: 'medium' },
  },
  '51-80': { // Plant & System Operators
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse', 'field'], schedule: ['shift', 'oncall'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 6, creative: 2, social: 3, technical: 8, leadership: 3, physical: 5, detail: 9 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability', 'financial_security'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '51-90': { // Other Production Occupations
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 4, creative: 3, social: 3, technical: 6, leadership: 2, physical: 7, detail: 7 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },
  '51-91': { // Other Production - machine operators/tenders
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'none' },
    skills: { analytical: 4, creative: 2, social: 3, technical: 6, leadership: 2, physical: 7, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'declining', automationRisk: 'high' },
  },

  // ── 53: Transportation & Material Moving ───────────────────────
  '53-10': { // Supervisors of Transportation & Material Moving
    careerCluster: 'trades', secondaryClusters: ['business'],
    workEnvironment: { setting: ['warehouse', 'field'], schedule: ['shift'], physicalDemands: 'light', travelRequired: 'occasional' },
    skills: { analytical: 6, creative: 3, social: 8, technical: 6, leadership: 9, physical: 4, detail: 7 },
    workStyle: { independence: 'mixed', structure: 'highly_structured', variety: 'moderate', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['leadership', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '53-20': { // Air Transportation
    careerCluster: 'trades', secondaryClusters: ['stem'],
    workEnvironment: { setting: ['field'], schedule: ['shift', 'oncall'], physicalDemands: 'light', travelRequired: 'constant' },
    skills: { analytical: 8, creative: 3, social: 5, technical: 9, leadership: 5, physical: 3, detail: 10 },
    workStyle: { independence: 'independent', structure: 'highly_structured', variety: 'moderate', pace: 'fast_paced', peopleInteraction: 'moderate' },
    values: ['prestige', 'financial_security', 'independence'],
    outlook: { growth: 'growing', automationRisk: 'low' },
  },
  '53-30': { // Motor Vehicle Operators
    careerCluster: 'trades',
    workEnvironment: { setting: ['field'], schedule: ['shift', 'flexible'], physicalDemands: 'medium', travelRequired: 'constant' },
    skills: { analytical: 4, creative: 2, social: 4, technical: 5, leadership: 2, physical: 6, detail: 7 },
    workStyle: { independence: 'independent', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['independence', 'stability'],
    outlook: { growth: 'stable', automationRisk: 'high' },
  },
  '53-40': { // Rail Transportation Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['field'], schedule: ['shift', 'oncall'], physicalDemands: 'medium', travelRequired: 'constant' },
    skills: { analytical: 5, creative: 2, social: 3, technical: 7, leadership: 3, physical: 5, detail: 9 },
    workStyle: { independence: 'independent', structure: 'highly_structured', variety: 'routine', pace: 'methodical', peopleInteraction: 'minimal' },
    values: ['stability', 'independence'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '53-50': { // Water Transportation Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['outdoor', 'field'], schedule: ['shift'], physicalDemands: 'heavy', travelRequired: 'constant' },
    skills: { analytical: 6, creative: 3, social: 4, technical: 7, leadership: 5, physical: 7, detail: 8 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
    values: ['independence', 'variety'],
    outlook: { growth: 'stable', automationRisk: 'low' },
  },
  '53-60': { // Other Transportation
    careerCluster: 'trades',
    workEnvironment: { setting: ['field'], schedule: ['shift'], physicalDemands: 'medium', travelRequired: 'frequent' },
    skills: { analytical: 4, creative: 2, social: 4, technical: 5, leadership: 2, physical: 6, detail: 7 },
    workStyle: { independence: 'independent', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['independence'],
    outlook: { growth: 'stable', automationRisk: 'medium' },
  },
  '53-70': { // Material Moving Workers
    careerCluster: 'trades',
    workEnvironment: { setting: ['warehouse', 'field'], schedule: ['shift'], physicalDemands: 'heavy', travelRequired: 'none' },
    skills: { analytical: 3, creative: 2, social: 3, technical: 5, leadership: 2, physical: 9, detail: 6 },
    workStyle: { independence: 'team', structure: 'highly_structured', variety: 'routine', pace: 'moderate', peopleInteraction: 'minimal' },
    values: ['stability'],
    outlook: { growth: 'stable', automationRisk: 'high' },
  },
};

// ─── Title-based keyword enrichment database ────────────────────────────────
// Maps title keywords to rich metadata: keywords, certifications, and overrides

interface TitleOverride {
  keywords: string[];
  certifications?: string[];
  careerCluster?: CareerCluster;
  secondaryClusters?: CareerCluster[];
  overrides?: Partial<OccupationMetadata['skills']>;
  outlookOverride?: Partial<OccupationMetadata['outlook']>;
  envOverride?: Partial<OccupationMetadata['workEnvironment']>;
  styleOverride?: Partial<OccupationMetadata['workStyle']>;
}

const TITLE_KEYWORD_MAP: Record<string, TitleOverride> = {
  // ── Software & IT ──
  'software': { keywords: ['software', 'programming', 'coding', 'development', 'agile', 'scrum', 'devops', 'full-stack', 'backend', 'frontend', 'api', 'cloud', 'saas', 'debugging', 'version control'], certifications: ['AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'CompTIA A+'], outlookOverride: { growth: 'much_faster_than_average', automationRisk: 'low' } },
  'developer': { keywords: ['developer', 'programming', 'coding', 'software engineering', 'web development', 'application development', 'full-stack', 'backend', 'frontend', 'api', 'databases', 'testing', 'deployment'], certifications: ['AWS Certified Developer', 'Microsoft Certified', 'Oracle Certified'], outlookOverride: { growth: 'much_faster_than_average', automationRisk: 'low' } },
  'web developer': { keywords: ['web development', 'html', 'css', 'javascript', 'react', 'angular', 'vue', 'responsive design', 'ux', 'ui', 'frontend', 'backend', 'api', 'cms'], certifications: ['Google UX Design', 'Meta Front-End Developer'], outlookOverride: { growth: 'much_faster_than_average', automationRisk: 'low' } },
  'programmer': { keywords: ['programming', 'coding', 'algorithms', 'software', 'debugging', 'data structures', 'automation', 'scripting'], outlookOverride: { growth: 'growing', automationRisk: 'medium' } },
  'database': { keywords: ['database', 'sql', 'nosql', 'data management', 'data modeling', 'database administration', 'performance tuning', 'backup', 'recovery', 'data integrity', 'etl', 'big data'], certifications: ['Oracle DBA', 'Microsoft SQL Server', 'MongoDB Certified'], overrides: { analytical: 9, technical: 10, detail: 10 } },
  'network': { keywords: ['networking', 'tcp/ip', 'firewalls', 'routing', 'switching', 'vpn', 'network security', 'lan', 'wan', 'wireless', 'cisco', 'infrastructure'], certifications: ['CCNA', 'CCNP', 'CompTIA Network+', 'CompTIA Security+'] },
  'cybersecurity': { keywords: ['cybersecurity', 'information security', 'penetration testing', 'vulnerability assessment', 'threat analysis', 'incident response', 'encryption', 'compliance', 'risk management', 'soc', 'siem'], certifications: ['CISSP', 'CEH', 'CompTIA Security+', 'CISM'], outlookOverride: { growth: 'much_faster_than_average', automationRisk: 'low' } },
  'information security': { keywords: ['information security', 'cybersecurity', 'risk assessment', 'compliance', 'auditing', 'access control', 'data protection', 'identity management', 'encryption', 'forensics'], certifications: ['CISSP', 'CISA', 'CompTIA Security+', 'CISM'], outlookOverride: { growth: 'much_faster_than_average', automationRisk: 'low' } },
  'systems admin': { keywords: ['systems administration', 'server management', 'linux', 'windows server', 'active directory', 'virtualization', 'cloud infrastructure', 'monitoring', 'troubleshooting', 'backup'], certifications: ['CompTIA Server+', 'Red Hat Certified', 'Microsoft Certified'], envOverride: { schedule: ['standard', 'oncall'] } },
  'data scientist': { keywords: ['data science', 'machine learning', 'statistics', 'python', 'r', 'data visualization', 'predictive modeling', 'deep learning', 'natural language processing', 'ai', 'big data'], certifications: ['IBM Data Science', 'Google Data Analytics'], overrides: { analytical: 10, creative: 8, technical: 10 }, outlookOverride: { growth: 'much_faster_than_average', automationRisk: 'low' } },
  'data analy': { keywords: ['data analysis', 'statistics', 'excel', 'sql', 'visualization', 'tableau', 'power bi', 'reporting', 'business intelligence', 'metrics', 'dashboards'], certifications: ['Google Data Analytics', 'IBM Data Analyst'] },

  // ── Engineering ──
  'civil engineer': { keywords: ['civil engineering', 'structural design', 'construction', 'infrastructure', 'transportation', 'water resources', 'surveying', 'project management', 'autocad', 'building codes'], certifications: ['PE License', 'FE Exam'] },
  'mechanical engineer': { keywords: ['mechanical engineering', 'thermodynamics', 'fluid mechanics', 'manufacturing', 'cad', 'solidworks', 'product design', 'hvac', 'robotics', 'materials science'], certifications: ['PE License', 'FE Exam', 'Six Sigma'] },
  'electrical engineer': { keywords: ['electrical engineering', 'circuits', 'power systems', 'electronics', 'embedded systems', 'plc', 'control systems', 'signal processing', 'renewable energy'], certifications: ['PE License', 'FE Exam'] },
  'chemical engineer': { keywords: ['chemical engineering', 'process design', 'thermodynamics', 'materials science', 'pharmaceuticals', 'chemical processes', 'quality control', 'environmental compliance'], certifications: ['PE License', 'FE Exam'] },
  'industrial engineer': { keywords: ['industrial engineering', 'process optimization', 'lean manufacturing', 'six sigma', 'supply chain', 'operations research', 'quality management', 'ergonomics', 'efficiency'], certifications: ['PE License', 'Six Sigma Green/Black Belt', 'CPIM'] },
  'environmental engineer': { keywords: ['environmental engineering', 'pollution control', 'sustainability', 'water treatment', 'waste management', 'environmental compliance', 'remediation', 'epa regulations'], certifications: ['PE License', 'LEED AP'] },
  'biomedical engineer': { keywords: ['biomedical engineering', 'medical devices', 'prosthetics', 'biomechanics', 'tissue engineering', 'fda regulation', 'clinical trials', 'imaging systems'], certifications: ['PE License'] },

  // ── Healthcare ──
  'nurse': { keywords: ['nursing', 'patient care', 'clinical assessment', 'medication administration', 'vital signs', 'wound care', 'ehr', 'collaboration', 'health education', 'emergency care', 'bedside manner'], certifications: ['RN License', 'NCLEX-RN', 'BLS', 'ACLS'], envOverride: { schedule: ['shift', 'oncall', 'weekend'] } },
  'physician': { keywords: ['medicine', 'diagnosis', 'treatment', 'patient care', 'clinical decision-making', 'medical procedures', 'prescriptions', 'lab interpretation', 'residency', 'research'], certifications: ['MD/DO', 'Board Certification', 'DEA License', 'State Medical License'] },
  'surgeon': { keywords: ['surgery', 'operating room', 'surgical procedures', 'anesthesia', 'preoperative', 'postoperative', 'trauma', 'minimally invasive', 'precision'], certifications: ['Board Certification', 'Fellowship'], overrides: { technical: 10, detail: 10, physical: 7 } },
  'dentist': { keywords: ['dentistry', 'oral health', 'dental procedures', 'cavity treatment', 'orthodontics', 'oral surgery', 'preventive care', 'dental hygiene', 'x-rays'], certifications: ['DDS/DMD', 'State Dental License', 'DEA License'] },
  'pharmacist': { keywords: ['pharmacy', 'medications', 'drug interactions', 'prescriptions', 'patient counseling', 'compounding', 'clinical pharmacy', 'pharmaceutical care', 'formulary management'], certifications: ['PharmD', 'NAPLEX', 'State Pharmacy License'] },
  'therapist': { keywords: ['therapy', 'rehabilitation', 'patient assessment', 'treatment planning', 'recovery', 'mobility', 'functional improvement', 'therapeutic exercises', 'patient education'], certifications: ['State License', 'Board Certification'] },
  'physical therapist': { keywords: ['physical therapy', 'rehabilitation', 'mobility', 'exercise prescription', 'musculoskeletal', 'sports medicine', 'pain management', 'functional assessment', 'manual therapy'], certifications: ['DPT', 'State PT License', 'APTA Board Certification'], overrides: { physical: 7, social: 9 } },
  'occupational therapist': { keywords: ['occupational therapy', 'daily living activities', 'rehabilitation', 'adaptive equipment', 'cognitive rehabilitation', 'pediatric therapy', 'geriatric care', 'hand therapy'], certifications: ['OTD/MOT', 'NBCOT Certification', 'State OT License'] },
  'speech': { keywords: ['speech therapy', 'language disorders', 'stuttering', 'voice therapy', 'swallowing disorders', 'aphasia', 'articulation', 'pediatric speech', 'augmentative communication'], certifications: ['CCC-SLP', 'State License'] },
  'radiolog': { keywords: ['radiology', 'x-ray', 'ct scan', 'mri', 'imaging', 'diagnostic imaging', 'radiation safety', 'patient positioning', 'contrast media'], certifications: ['ARRT Certification', 'State License'] },
  'anesthesi': { keywords: ['anesthesia', 'sedation', 'pain management', 'airway management', 'monitoring', 'pre-anesthesia assessment', 'regional anesthesia', 'critical care'], certifications: ['Board Certification', 'ACLS', 'BLS'], overrides: { analytical: 10, technical: 10, detail: 10 } },
  'veterinar': { keywords: ['veterinary medicine', 'animal care', 'surgery', 'diagnosis', 'preventive care', 'animal health', 'emergency care', 'zoonotic diseases', 'pharmaceuticals'], certifications: ['DVM', 'State Veterinary License', 'DEA License'] },
  'optom': { keywords: ['optometry', 'vision care', 'eye exams', 'corrective lenses', 'glaucoma', 'retinal assessment', 'contact lenses', 'vision therapy'], certifications: ['OD', 'State Optometry License'] },
  'paramedic': { keywords: ['emergency medical services', 'patient assessment', 'trauma care', 'cardiac arrest', 'advanced life support', 'patient transport', 'triage', 'emergency response'], certifications: ['NREMT-P', 'ACLS', 'BLS', 'PALS', 'State EMS License'], envOverride: { setting: ['field'], physicalDemands: 'heavy', schedule: ['shift', 'oncall'] } },
  'medical assistant': { keywords: ['medical assisting', 'clinical procedures', 'vital signs', 'phlebotomy', 'ehr', 'patient intake', 'injection administration', 'scheduling'], certifications: ['CMA', 'RMA'] },
  'dental hygien': { keywords: ['dental hygiene', 'teeth cleaning', 'periodontal assessment', 'patient education', 'dental x-rays', 'fluoride treatment', 'oral health screening'], certifications: ['RDH', 'State Dental Hygiene License'] },
  'phlebotom': { keywords: ['phlebotomy', 'blood draw', 'venipuncture', 'specimen collection', 'patient safety', 'laboratory procedures', 'infection control'], certifications: ['CPT', 'National Phlebotomy Certification'] },

  // ── Education ──
  'teacher': { keywords: ['teaching', 'curriculum', 'lesson planning', 'classroom management', 'student assessment', 'differentiated instruction', 'educational technology', 'parent communication', 'special education', 'grading'], certifications: ['State Teaching Certificate', 'Praxis Exam'] },
  'professor': { keywords: ['higher education', 'research', 'academic publishing', 'curriculum development', 'mentoring', 'grant writing', 'tenure', 'peer review', 'academic advising', 'university teaching'], certifications: ['PhD/EdD'] },
  'postsecondary': { keywords: ['higher education', 'college instruction', 'curriculum', 'academic research', 'student mentoring', 'course development', 'grading', 'academic advising'], certifications: ['PhD/Master\'s in Field'] },
  'librarian': { keywords: ['library science', 'information management', 'cataloging', 'reference services', 'digital resources', 'collection development', 'literacy programs', 'community outreach'], certifications: ['MLS/MLIS', 'State Library Certification'] },
  'special education': { keywords: ['special education', 'iep', 'individualized instruction', 'disability accommodation', 'behavioral intervention', 'assistive technology', 'inclusion', 'adapted curriculum'], certifications: ['State Special Education Certificate', 'Praxis Exam'] },
  'counselor': { keywords: ['counseling', 'mental health', 'crisis intervention', 'individual therapy', 'group therapy', 'assessment', 'treatment planning', 'case management', 'advocacy'], certifications: ['LPC', 'LCSW', 'NCC', 'State License'] },

  // ── Legal ──
  'lawyer': { keywords: ['law', 'litigation', 'legal research', 'contract drafting', 'court proceedings', 'client representation', 'negotiation', 'regulatory compliance', 'brief writing', 'case management'], certifications: ['JD', 'Bar Admission', 'State Bar License'] },
  'attorney': { keywords: ['law', 'litigation', 'legal research', 'contract drafting', 'court proceedings', 'client representation', 'negotiation', 'regulatory compliance', 'brief writing'], certifications: ['JD', 'State Bar License'] },
  'judge': { keywords: ['judicial proceedings', 'case law', 'courtroom management', 'legal interpretation', 'sentencing', 'constitutional law', 'trial proceedings'], certifications: ['JD', 'Judicial Appointment/Election'] },
  'paralegal': { keywords: ['legal research', 'document preparation', 'case management', 'filing', 'discovery', 'legal writing', 'client communication', 'litigation support'], certifications: ['Certified Paralegal', 'NALA Certification'] },

  // ── Business & Finance ──
  'accountant': { keywords: ['accounting', 'auditing', 'tax preparation', 'financial statements', 'gaap', 'bookkeeping', 'payroll', 'budgeting', 'financial analysis', 'compliance'], certifications: ['CPA', 'CMA', 'CIA'] },
  'auditor': { keywords: ['auditing', 'internal controls', 'compliance', 'risk assessment', 'financial review', 'fraud detection', 'regulatory standards', 'sox compliance'], certifications: ['CPA', 'CIA', 'CISA'] },
  'financial analyst': { keywords: ['financial analysis', 'modeling', 'forecasting', 'investment', 'valuation', 'excel', 'financial reporting', 'risk analysis', 'capital markets', 'budgeting'], certifications: ['CFA', 'FRM'] },
  'financial advisor': { keywords: ['financial planning', 'investment management', 'retirement planning', 'wealth management', 'estate planning', 'insurance', 'portfolio management', 'client relations'], certifications: ['CFP', 'Series 7', 'Series 66'] },
  'insurance': { keywords: ['insurance', 'underwriting', 'risk assessment', 'claims processing', 'policy analysis', 'actuarial', 'customer service', 'regulatory compliance'], certifications: ['CPCU', 'CLU', 'State Insurance License'] },
  'actuar': { keywords: ['actuarial science', 'risk modeling', 'statistics', 'probability', 'insurance mathematics', 'pension', 'financial forecasting', 'data analysis'], certifications: ['ASA', 'FSA', 'SOA Exams'], overrides: { analytical: 10, technical: 9, detail: 10 } },
  'human resource': { keywords: ['human resources', 'recruiting', 'employee relations', 'compensation', 'benefits', 'training', 'compliance', 'performance management', 'onboarding', 'labor law'], certifications: ['SHRM-CP', 'SHRM-SCP', 'PHR', 'SPHR'] },
  'project manager': { keywords: ['project management', 'planning', 'scheduling', 'budgeting', 'risk management', 'stakeholder management', 'agile', 'waterfall', 'scope management', 'team leadership'], certifications: ['PMP', 'CAPM', 'Scrum Master'] },
  'management analyst': { keywords: ['management consulting', 'process improvement', 'strategic planning', 'organizational analysis', 'change management', 'efficiency', 'data analysis', 'recommendations'], certifications: ['CMC', 'PMP'] },

  // ── Marketing & Communications ──
  'marketing': { keywords: ['marketing', 'branding', 'digital marketing', 'social media', 'market research', 'campaign management', 'advertising', 'seo', 'analytics', 'content strategy'], certifications: ['Google Ads', 'HubSpot Certified', 'Meta Blueprint'] },
  'public relations': { keywords: ['public relations', 'media relations', 'press releases', 'crisis communication', 'brand management', 'stakeholder engagement', 'social media', 'event planning'], certifications: ['APR'] },
  'journalist': { keywords: ['journalism', 'reporting', 'writing', 'interviewing', 'editing', 'research', 'media ethics', 'deadline management', 'fact-checking', 'storytelling'], certifications: [] },
  'editor': { keywords: ['editing', 'proofreading', 'content management', 'writing', 'style guides', 'publishing', 'manuscript review', 'copyediting', 'fact-checking'], certifications: [] },
  'writer': { keywords: ['writing', 'content creation', 'storytelling', 'editing', 'research', 'creative writing', 'copywriting', 'blogging', 'technical writing'], certifications: [] },
  'graphic design': { keywords: ['graphic design', 'visual communication', 'adobe creative suite', 'typography', 'layout', 'branding', 'illustration', 'ui design', 'print design', 'digital design'], certifications: ['Adobe Certified Professional'] },
  'photographer': { keywords: ['photography', 'photo editing', 'lighting', 'composition', 'adobe lightroom', 'photoshop', 'portrait photography', 'commercial photography', 'video'], certifications: ['CPP'] },
  'interpreter': { keywords: ['interpretation', 'translation', 'bilingual', 'cultural competency', 'consecutive interpretation', 'simultaneous interpretation', 'localization', 'language proficiency'], certifications: ['ATA Certification', 'Court Interpreter Certification'] },
  'translator': { keywords: ['translation', 'localization', 'language proficiency', 'cultural adaptation', 'proofreading', 'terminology management', 'cat tools'], certifications: ['ATA Certification'] },

  // ── Trades & Construction ──
  'electrician': { keywords: ['electrical work', 'wiring', 'circuits', 'electrical codes', 'troubleshooting', 'installation', 'nec', 'residential electrical', 'commercial electrical', 'conduit', 'panels'], certifications: ['Journeyman Electrician', 'Master Electrician', 'State License'] },
  'plumber': { keywords: ['plumbing', 'pipe fitting', 'water systems', 'drainage', 'installation', 'repair', 'plumbing codes', 'soldering', 'fixture installation'], certifications: ['Journeyman Plumber', 'Master Plumber', 'State License'] },
  'carpenter': { keywords: ['carpentry', 'woodworking', 'framing', 'cabinetry', 'blueprint reading', 'power tools', 'finish work', 'trimming', 'renovation'], certifications: ['Journeyman Carpenter'] },
  'hvac': { keywords: ['hvac', 'heating', 'air conditioning', 'refrigeration', 'ventilation', 'ductwork', 'thermostat', 'compressor', 'energy efficiency', 'troubleshooting'], certifications: ['EPA 608 Certification', 'NATE Certification', 'State HVAC License'] },
  'welder': { keywords: ['welding', 'mig', 'tig', 'stick welding', 'metal fabrication', 'blueprint reading', 'grinding', 'brazing', 'cutting', 'structural welding'], certifications: ['AWS Certification', 'Welding Inspector'] },
  'machinist': { keywords: ['machining', 'cnc', 'lathe', 'milling', 'precision measurement', 'blueprint reading', 'tooling', 'grinding', 'cad/cam', 'quality control'], certifications: ['NIMS Certification', 'CNC Certification'] },
  'mechanic': { keywords: ['mechanical repair', 'diagnostics', 'engine', 'transmission', 'brake systems', 'preventive maintenance', 'troubleshooting', 'hydraulics'], certifications: ['ASE Certification'] },
  'automotive': { keywords: ['automotive repair', 'engine diagnostics', 'brake systems', 'transmission', 'electrical systems', 'emission systems', 'suspension', 'alignment', 'obd'], certifications: ['ASE Certification', 'State Inspection License'] },
  'construction manager': { keywords: ['construction management', 'project planning', 'budgeting', 'scheduling', 'building codes', 'subcontractor management', 'safety compliance', 'site inspection', 'blueprints'], certifications: ['CCM', 'PMP', 'OSHA 30'] },

  // ── Social Services ──
  'social worker': { keywords: ['social work', 'case management', 'crisis intervention', 'advocacy', 'counseling', 'community resources', 'child welfare', 'family services', 'mental health', 'substance abuse'], certifications: ['LCSW', 'LSW', 'State Social Work License'] },
  'psychologist': { keywords: ['psychology', 'behavioral assessment', 'psychotherapy', 'cognitive behavioral therapy', 'testing', 'research', 'diagnosis', 'treatment planning', 'mental health'], certifications: ['PhD/PsyD', 'State Psychology License'] },
  'substance abuse': { keywords: ['substance abuse', 'addiction counseling', 'recovery', 'group therapy', '12-step', 'drug testing', 'relapse prevention', 'mental health co-occurring'], certifications: ['CADC', 'CASAC', 'State License'] },
  'probation': { keywords: ['probation', 'parole', 'case management', 'criminal justice', 'court reporting', 'supervision', 'rehabilitation', 'risk assessment'], certifications: ['State Certification'] },
  'child': { keywords: ['child development', 'early childhood', 'childcare', 'pediatric', 'youth services', 'family support', 'educational development', 'behavioral management'] },

  // ── Protective Services ──
  'police': { keywords: ['law enforcement', 'patrol', 'investigation', 'crime prevention', 'traffic enforcement', 'community policing', 'evidence collection', 'arrest procedures', 'report writing'], certifications: ['Police Academy', 'State Police Certification', 'CPR/First Aid'] },
  'detective': { keywords: ['criminal investigation', 'evidence analysis', 'interviewing', 'surveillance', 'case management', 'forensics', 'crime scene investigation', 'criminal profiling'], certifications: ['Police Certification', 'Detective Certification'] },
  'firefighter': { keywords: ['firefighting', 'fire suppression', 'emergency response', 'hazmat', 'rescue operations', 'fire prevention', 'ems', 'equipment operation', 'physical fitness'], certifications: ['Firefighter I/II', 'EMT', 'Paramedic', 'Hazmat Operations'], envOverride: { physicalDemands: 'veryHeavy' } },
  'security guard': { keywords: ['security', 'surveillance', 'access control', 'patrol', 'threat assessment', 'emergency procedures', 'loss prevention', 'incident reporting'], certifications: ['Guard Card', 'CPP', 'PSP'] },
  'correction': { keywords: ['corrections', 'inmate supervision', 'facility security', 'risk assessment', 'crisis management', 'report writing', 'rehabilitation programs'], certifications: ['Corrections Officer Training', 'State Certification'] },

  // ── Culinary / Food ──
  'chef': { keywords: ['culinary arts', 'menu planning', 'food preparation', 'kitchen management', 'food safety', 'nutrition', 'inventory', 'recipe development', 'plating', 'cooking techniques'], certifications: ['ServSafe', 'ACF Certification'], careerCluster: 'arts', overrides: { creative: 9, leadership: 7 } },
  'cook': { keywords: ['cooking', 'food preparation', 'kitchen operations', 'recipes', 'food safety', 'grilling', 'baking', 'sauteing', 'food presentation'], certifications: ['ServSafe', 'Food Handler Certificate'] },
  'baker': { keywords: ['baking', 'pastry', 'bread making', 'cake decorating', 'food science', 'recipe development', 'food safety', 'ingredient measurement'], certifications: ['ServSafe', 'Certified Baker'], careerCluster: 'arts' },
  'bartender': { keywords: ['mixology', 'beverage service', 'customer service', 'cocktail recipes', 'responsible alcohol service', 'cash handling', 'inventory'], certifications: ['TIPS Certification', 'ServSafe Alcohol'] },

  // ── Transportation ──
  'pilot': { keywords: ['aviation', 'flight operations', 'navigation', 'aircraft systems', 'weather analysis', 'air traffic communication', 'pre-flight inspection', 'instrument flying', 'emergency procedures'], certifications: ['ATP License', 'Commercial Pilot License', 'Instrument Rating', 'FAA Medical Certificate'] },
  'air traffic': { keywords: ['air traffic control', 'radar', 'aviation safety', 'communication', 'decision-making', 'flight paths', 'clearances', 'weather monitoring'], certifications: ['FAA ATC Certification'], overrides: { analytical: 10, detail: 10 }, envOverride: { schedule: ['shift', 'oncall'] } },
  'truck driver': { keywords: ['trucking', 'cdl', 'freight', 'logistics', 'long-haul', 'vehicle inspection', 'dot regulations', 'load securing', 'route planning', 'hours of service'], certifications: ['CDL', 'DOT Medical Card', 'Hazmat Endorsement'] },
  'bus driver': { keywords: ['bus driving', 'passenger safety', 'route navigation', 'traffic laws', 'vehicle inspection', 'cdl', 'customer service'], certifications: ['CDL with Passenger Endorsement'] },

  // ── Misc High-Relevance ──
  'architect': { keywords: ['architecture', 'building design', 'blueprints', 'autocad', 'revit', 'building codes', 'urban planning', 'sustainable design', 'structural analysis', 'client presentations'], certifications: ['Licensed Architect (RA)', 'LEED AP', 'NCARB'] },
  'surveyor': { keywords: ['surveying', 'land measurement', 'gps', 'gis', 'topography', 'boundary determination', 'construction staking', 'property maps'], certifications: ['PLS License'] },
  'drafter': { keywords: ['drafting', 'autocad', 'technical drawing', 'blueprint reading', 'cad', '3d modeling', 'revit', 'solidworks', 'design documentation'], certifications: ['ADDA Certification'] },
  'technician': { keywords: ['technical support', 'troubleshooting', 'equipment maintenance', 'testing', 'calibration', 'repair', 'documentation', 'quality control'] },
  'inspector': { keywords: ['inspection', 'quality control', 'compliance', 'safety standards', 'code enforcement', 'documentation', 'report writing', 'regulatory requirements'], certifications: ['Certified Inspector'] },
  'estimator': { keywords: ['cost estimation', 'bidding', 'material takeoff', 'project costing', 'blueprint reading', 'quantity surveying', 'construction costs', 'proposal writing'], certifications: ['AACE Certification', 'CPE'] },
  'real estate': { keywords: ['real estate', 'property valuation', 'market analysis', 'property management', 'leasing', 'sales', 'zoning', 'investment analysis', 'closings'], certifications: ['Real Estate License', 'MAI', 'CRE'] },
  'logist': { keywords: ['logistics', 'supply chain', 'inventory management', 'warehousing', 'distribution', 'procurement', 'transportation', 'shipping', 'erp systems'], certifications: ['CSCP', 'CPIM', 'CTL'] },
  'supply chain': { keywords: ['supply chain management', 'procurement', 'vendor management', 'inventory', 'logistics', 'demand planning', 'lean', 'sourcing', 'distribution'], certifications: ['CSCP', 'CPIM', 'Six Sigma'] },
  'purchas': { keywords: ['purchasing', 'procurement', 'vendor management', 'contract negotiation', 'supply chain', 'cost analysis', 'inventory management', 'rfp/rfq'], certifications: ['CPSM', 'CPP'] },
  'compliance': { keywords: ['compliance', 'regulatory affairs', 'risk management', 'auditing', 'policy development', 'investigations', 'ethics', 'reporting'], certifications: ['CCEP', 'CRCM'] },
  'training': { keywords: ['training', 'instructional design', 'curriculum development', 'facilitation', 'e-learning', 'adult learning', 'performance improvement', 'onboarding'], certifications: ['CPTD', 'ATD Certification'] },
  'research': { keywords: ['research', 'data collection', 'analysis', 'scientific method', 'experimentation', 'publication', 'peer review', 'grant writing', 'literature review'] },
  'statistic': { keywords: ['statistics', 'data analysis', 'probability', 'regression', 'hypothesis testing', 'sampling', 'experimental design', 'statistical software', 'r', 'sas', 'spss'], certifications: ['AStat', 'PStat'] },
  'economist': { keywords: ['economics', 'economic analysis', 'forecasting', 'policy analysis', 'quantitative methods', 'market research', 'macroeconomics', 'microeconomics'], overrides: { analytical: 10 } },
  'urban planner': { keywords: ['urban planning', 'zoning', 'land use', 'community development', 'gis', 'transportation planning', 'environmental impact', 'public policy', 'comprehensive planning'], certifications: ['AICP'] },
  'environmental': { keywords: ['environmental science', 'sustainability', 'conservation', 'environmental impact', 'ecology', 'pollution', 'waste management', 'remediation', 'climate science'] },
  'geolog': { keywords: ['geology', 'earth science', 'geological surveys', 'mineral exploration', 'geotechnical', 'hydrology', 'seismology', 'soil analysis', 'field mapping'], certifications: ['PG License'] },
  'chemist': { keywords: ['chemistry', 'chemical analysis', 'laboratory techniques', 'spectroscopy', 'chromatography', 'quality control', 'r&d', 'materials testing', 'formulation'], certifications: ['ACS Certification'] },
  'biolog': { keywords: ['biology', 'biological research', 'laboratory techniques', 'molecular biology', 'genetics', 'ecology', 'microbiology', 'cell culture', 'data analysis'] },
  'physicist': { keywords: ['physics', 'mathematical modeling', 'experimental design', 'quantum mechanics', 'optics', 'thermodynamics', 'particle physics', 'computational physics'] },
  'animal': { keywords: ['animal care', 'animal behavior', 'animal health', 'veterinary support', 'grooming', 'feeding', 'exercise', 'kennel management', 'pet sitting'] },
  'funeral': { keywords: ['funeral services', 'embalming', 'grief counseling', 'memorial planning', 'death certificates', 'family support', 'mortuary science'], certifications: ['Funeral Director License', 'Embalmer License'] },
  'cosmetolog': { keywords: ['cosmetology', 'hair styling', 'hair coloring', 'skin care', 'nails', 'beauty treatments', 'salon management', 'client consultation'], certifications: ['State Cosmetology License'] },
  'barber': { keywords: ['barbering', 'hair cutting', 'styling', 'shaving', 'beard trimming', 'scalp treatments', 'client consultation'], certifications: ['State Barber License'] },
  'skincare': { keywords: ['skincare', 'facials', 'esthetics', 'skin analysis', 'chemical peels', 'microdermabrasion', 'anti-aging', 'client consultation'], certifications: ['State Esthetician License'] },
  'massage': { keywords: ['massage therapy', 'swedish massage', 'deep tissue', 'sports massage', 'anatomy', 'physiology', 'pain relief', 'relaxation therapy'], certifications: ['LMT', 'NCBTMB Certification', 'State Massage License'] },
  'fitness': { keywords: ['fitness training', 'exercise programming', 'nutrition', 'strength training', 'cardiovascular fitness', 'flexibility', 'client assessment', 'goal setting'], certifications: ['NASM-CPT', 'ACE', 'CSCS', 'CPR/AED'] },
  'athletic train': { keywords: ['athletic training', 'sports medicine', 'injury prevention', 'rehabilitation', 'emergency care', 'taping', 'bracing', 'concussion assessment'], certifications: ['ATC', 'BOC Certification', 'State License'] },
  'recreation': { keywords: ['recreation', 'program planning', 'community recreation', 'sports', 'outdoor recreation', 'event coordination', 'youth programs', 'leisure services'] },
  'clergy': { keywords: ['religious leadership', 'pastoral care', 'sermon preparation', 'community outreach', 'counseling', 'worship planning', 'ministry', 'spiritual guidance'] },
  'dispatcher': { keywords: ['dispatching', 'emergency communication', 'radio operation', 'multitasking', 'gps', 'routing', 'call handling', 'crisis communication', 'cad systems'], certifications: ['EMD Certification', 'CPR'], envOverride: { schedule: ['shift', 'oncall'] } },

  // ── Broader catch patterns for professional roles ──
  'engineer': { keywords: ['engineering', 'design', 'analysis', 'testing', 'specifications', 'technical problem solving'], certifications: ['PE License', 'FE Exam'] },
  'registered nurse': { keywords: ['registered nursing', 'patient care', 'clinical assessment', 'care coordination', 'health monitoring'], certifications: ['RN License', 'NCLEX-RN', 'BLS'] },
  'practitioner': { keywords: ['clinical practice', 'patient assessment', 'treatment', 'healthcare delivery', 'clinical judgment'], certifications: ['State Clinical License'] },
  'technologist': { keywords: ['technical procedures', 'equipment operation', 'diagnostic testing', 'quality assurance', 'safety protocols'] },
  'specialist': { keywords: ['specialized knowledge', 'expert analysis', 'technical expertise', 'professional consultation'] },
  'analyst': { keywords: ['analysis', 'research', 'reporting', 'evaluation', 'data interpretation', 'recommendations'] },
  'coordinator': { keywords: ['coordination', 'scheduling', 'communication', 'project support', 'stakeholder liaison', 'logistics'] },
  'administrator': { keywords: ['administration', 'policy implementation', 'records management', 'organizational support', 'process management'] },
  'clerk': { keywords: ['clerical work', 'data entry', 'record keeping', 'filing', 'customer service', 'office procedures'] },
  'operator': { keywords: ['equipment operation', 'machine operation', 'process monitoring', 'safety compliance', 'routine maintenance'] },
  'assembler': { keywords: ['assembly', 'component fitting', 'quality inspection', 'hand tools', 'production line work', 'blueprints'] },
  'installer': { keywords: ['installation', 'setup', 'configuration', 'equipment mounting', 'testing', 'customer service'] },
  'repairer': { keywords: ['repair', 'maintenance', 'troubleshooting', 'parts replacement', 'testing', 'diagnostic'] },
  'laborer': { keywords: ['manual labor', 'physical work', 'material handling', 'site preparation', 'cleanup', 'heavy lifting'] },
  'driver': { keywords: ['driving', 'vehicle operation', 'navigation', 'safety compliance', 'route management', 'delivery'] },
  'foreman': { keywords: ['crew supervision', 'work coordination', 'safety oversight', 'schedule management', 'quality control'] },
  'superintendent': { keywords: ['project oversight', 'site management', 'contractor coordination', 'budget management', 'safety compliance'] },
  'director': { keywords: ['organizational leadership', 'strategic planning', 'department management', 'policy development', 'budget oversight'] },
  'executive': { keywords: ['executive leadership', 'strategic vision', 'board relations', 'organizational management', 'decision making'] },
  'bookkeeper': { keywords: ['bookkeeping', 'accounts payable', 'accounts receivable', 'bank reconciliation', 'financial records', 'quickbooks'], certifications: ['Certified Bookkeeper'] },
  'loan': { keywords: ['loan processing', 'underwriting', 'credit analysis', 'mortgage', 'financial assessment', 'documentation review'], certifications: ['NMLS License'] },
  'teller': { keywords: ['banking', 'cash handling', 'customer service', 'transaction processing', 'account management'] },
  'receptionist': { keywords: ['reception', 'front desk', 'phone management', 'scheduling', 'visitor management', 'customer greeting'] },
  'medical record': { keywords: ['medical records', 'health information', 'coding', 'ehr', 'hipaa compliance', 'data management'], certifications: ['RHIT', 'RHIA', 'CCS'] },
  'health information': { keywords: ['health informatics', 'medical coding', 'ehr systems', 'hipaa', 'clinical data', 'health records'], certifications: ['RHIA', 'RHIT', 'CCS'] },
  'respiratory': { keywords: ['respiratory therapy', 'ventilator management', 'oxygen therapy', 'pulmonary function', 'airway management', 'patient monitoring'], certifications: ['RRT', 'CRT', 'State License'] },
  'sonograph': { keywords: ['diagnostic sonography', 'ultrasound', 'imaging', 'patient positioning', 'anatomy', 'fetal monitoring'], certifications: ['RDMS', 'ARDMS Certification'] },
  'mri': { keywords: ['magnetic resonance imaging', 'mri scanning', 'patient preparation', 'imaging protocols', 'safety screening'], certifications: ['ARRT MRI Certification'] },
  'surgical tech': { keywords: ['surgical technology', 'operating room', 'sterile technique', 'instrument handling', 'patient preparation'], certifications: ['CST', 'TS-C'] },
  'optic': { keywords: ['optics', 'lens crafting', 'eyewear fitting', 'prescription interpretation', 'frame adjustment'], certifications: ['ABO Certification'] },
  'emerg': { keywords: ['emergency services', 'crisis response', 'first response', 'triage', 'emergency assessment', 'life support'], certifications: ['EMT', 'BLS', 'ACLS'] },
  'psychiatric': { keywords: ['psychiatric care', 'mental health treatment', 'behavioral assessment', 'medication management', 'crisis intervention', 'therapeutic communication'] },
  'occupational health': { keywords: ['occupational health', 'workplace safety', 'injury prevention', 'ergonomics', 'osha compliance', 'hazard assessment'], certifications: ['CSP', 'CIH', 'OSHA Certifications'] },
  'safety': { keywords: ['safety management', 'risk assessment', 'osha compliance', 'hazard analysis', 'safety training', 'incident investigation'], certifications: ['CSP', 'OSHA 30', 'BCSP Certification'] },
};

// ─── Utility: deep merge for metadata ────────────────────────────────────────

function deepMergeMetadata(base: OccupationMetadata, override: Partial<TitleOverride>): OccupationMetadata {
  const result = { ...base };

  if (override.careerCluster) result.careerCluster = override.careerCluster;
  if (override.secondaryClusters) result.secondaryClusters = override.secondaryClusters;

  if (override.overrides) {
    result.skills = { ...result.skills, ...override.overrides };
  }
  if (override.outlookOverride) {
    result.outlook = { ...result.outlook, ...override.outlookOverride };
  }
  if (override.envOverride) {
    result.workEnvironment = { ...result.workEnvironment, ...override.envOverride };
  }
  if (override.styleOverride) {
    result.workStyle = { ...result.workStyle, ...override.styleOverride };
  }

  // Append keywords and certifications (dedup)
  if (override.keywords) {
    result.keywords = Array.from(new Set([...result.keywords, ...override.keywords]));
  }
  if (override.certifications) {
    result.certifications = Array.from(new Set([...(result.certifications || []), ...override.certifications]));
  }

  return result;
}

// ─── Base keywords by sub-group (fills gaps where templates don't have keywords) ─
// These provide domain-specific baseline keywords for every sub-group so even
// occupations that don't match any title pattern still get meaningful terms.

const SUB_GROUP_BASE_KEYWORDS: Record<string, string[]> = {
  // 15: Computer & Mathematical
  '15-10': ['computer science', 'technology', 'it support', 'system administration', 'technical troubleshooting'],
  '15-12': ['computer science', 'systems analysis', 'information technology', 'data analysis', 'technical research'],
  '15-13': ['software development', 'programming', 'coding', 'application development', 'software testing', 'agile'],
  // 25: Education
  '25-10': ['higher education', 'academic instruction', 'research', 'curriculum development', 'student mentoring', 'university teaching'],
  '25-11': ['postsecondary teaching', 'academic research', 'curriculum', 'course development', 'student advising', 'higher education'],
  '25-30': ['teaching', 'instruction', 'tutoring', 'educational support', 'training', 'skill development'],
  '25-40': ['library science', 'information management', 'archival work', 'cataloging', 'collection management', 'reference services'],
  '25-90': ['educational support', 'teaching assistance', 'instructional aid', 'student support', 'classroom support'],
  // 27: Arts, Design, Entertainment, Sports, Media
  '27-10': ['visual arts', 'design', 'creative production', 'aesthetic composition', 'digital design', 'illustration'],
  '27-20': ['performance', 'entertainment', 'artistic expression', 'performing arts', 'athletics', 'choreography'],
  '27-30': ['media production', 'writing', 'communication', 'journalism', 'content creation', 'broadcasting'],
  '27-40': ['audio engineering', 'video production', 'broadcast equipment', 'media technology', 'sound mixing', 'recording'],
  // 29: Healthcare Practitioners
  '29-10': ['medical diagnosis', 'patient treatment', 'clinical care', 'medical examination', 'healthcare delivery', 'patient assessment'],
  '29-11': ['therapeutic treatment', 'rehabilitation', 'patient care', 'clinical therapy', 'recovery planning', 'health education'],
  '29-12': ['medical practice', 'physician care', 'clinical diagnosis', 'patient management', 'medical procedures', 'prescription'],
  '29-20': ['medical technology', 'diagnostic testing', 'clinical laboratory', 'patient monitoring', 'health screening', 'medical equipment'],
  '29-90': ['healthcare practice', 'clinical services', 'patient care', 'health assessment', 'medical support'],
  // 31: Healthcare Support
  '31-10': ['patient assistance', 'nursing support', 'home health', 'daily living assistance', 'vital signs monitoring', 'bedside care'],
  '31-20': ['clinical support', 'medical assistance', 'patient intake', 'healthcare support', 'medical procedures support'],
  '31-90': ['healthcare support', 'patient assistance', 'clinical aide', 'health services support'],
  // 33: Protective Service
  '33-10': ['protective services supervision', 'public safety management', 'emergency coordination', 'security oversight'],
  '33-20': ['fire suppression', 'emergency response', 'fire prevention', 'rescue operations', 'hazardous materials', 'fire safety'],
  '33-30': ['law enforcement', 'public safety', 'crime prevention', 'patrol', 'investigation', 'community protection'],
  '33-90': ['security services', 'surveillance', 'access control', 'patrol', 'safety monitoring', 'loss prevention'],
  // 35: Food Preparation & Serving
  '35-10': ['food service management', 'restaurant supervision', 'kitchen management', 'staff coordination', 'food safety compliance'],
  '35-20': ['food preparation', 'cooking', 'kitchen operations', 'recipe execution', 'food safety', 'meal planning'],
  '35-30': ['food service', 'customer service', 'beverage service', 'order taking', 'table service', 'hospitality'],
  '35-90': ['food service support', 'kitchen assistance', 'food handling', 'dishwashing', 'food preparation support'],
  // 37: Building & Grounds Cleaning and Maintenance
  '37-10': ['facility management', 'custodial supervision', 'building maintenance oversight', 'grounds management'],
  '37-20': ['building cleaning', 'custodial services', 'janitorial work', 'sanitization', 'floor care', 'facility maintenance'],
  '37-30': ['landscaping', 'grounds maintenance', 'lawn care', 'gardening', 'tree trimming', 'outdoor maintenance'],
  // 39: Personal Care & Service
  '39-10': ['personal care supervision', 'service management', 'staff coordination', 'client services oversight'],
  '39-20': ['animal care', 'animal grooming', 'pet care', 'animal training', 'kennel management', 'veterinary assistance'],
  '39-30': ['entertainment services', 'event support', 'recreation', 'guest services', 'venue operations'],
  '39-40': ['funeral services', 'mortuary science', 'grief support', 'memorial arrangements', 'death care', 'embalming'],
  '39-50': ['personal grooming', 'beauty services', 'hair styling', 'skincare', 'cosmetics', 'client consultation'],
  '39-60': ['hospitality', 'guest services', 'travel assistance', 'lodging services', 'concierge', 'tourism'],
  '39-70': ['tour guidance', 'travel narration', 'sightseeing', 'cultural interpretation', 'outdoor recreation leadership'],
  '39-90': ['personal assistance', 'caregiving', 'companion care', 'personal services', 'client support'],
  // 41: Sales
  '41-10': ['sales management', 'retail supervision', 'team leadership', 'revenue targets', 'customer relations', 'sales strategy'],
  '41-20': ['retail sales', 'customer service', 'merchandise knowledge', 'point of sale', 'product demonstration', 'cash handling'],
  '41-30': ['sales representation', 'client acquisition', 'account management', 'business development', 'negotiation', 'presentations'],
  '41-40': ['wholesale sales', 'product knowledge', 'territory management', 'client relationships', 'order fulfillment', 'trade shows'],
  '41-90': ['sales support', 'customer engagement', 'product promotion', 'client services', 'sales coordination'],
  // 43: Office & Administrative Support
  '43-10': ['office management', 'administrative supervision', 'staff coordination', 'workflow management', 'office operations'],
  '43-20': ['telephone operation', 'switchboard', 'call routing', 'communication systems', 'dispatch coordination'],
  '43-30': ['bookkeeping', 'billing', 'accounts payable', 'accounts receivable', 'payroll processing', 'financial records'],
  '43-40': ['records management', 'data entry', 'filing', 'customer reception', 'information processing', 'scheduling'],
  '43-50': ['shipping', 'receiving', 'inventory', 'dispatching', 'scheduling', 'material tracking', 'logistics coordination'],
  '43-60': ['administrative support', 'scheduling', 'correspondence', 'document management', 'office coordination', 'typing'],
  '43-90': ['office support', 'clerical work', 'data processing', 'mail handling', 'copying', 'office equipment operation'],
  // 45: Farming, Fishing, Forestry
  '45-10': ['agricultural management', 'farm supervision', 'crop management', 'livestock oversight', 'harvest coordination'],
  '45-20': ['farming', 'crop cultivation', 'harvesting', 'planting', 'irrigation', 'soil preparation', 'agricultural labor'],
  '45-30': ['commercial fishing', 'hunting', 'trapping', 'wildlife management', 'marine harvesting'],
  '45-40': ['forestry', 'logging', 'timber harvesting', 'conservation', 'forest management', 'tree felling'],
  // 47: Construction & Extraction
  '47-10': ['construction supervision', 'project oversight', 'crew management', 'building coordination', 'safety compliance'],
  '47-20': ['construction trades', 'building construction', 'renovation', 'structural work', 'site work', 'skilled labor'],
  '47-21': ['specialty trade construction', 'installation', 'building systems', 'code compliance', 'skilled craftsmanship'],
  '47-30': ['construction support', 'material handling', 'site cleanup', 'tool operation', 'labor assistance'],
  '47-40': ['construction specialty', 'demolition', 'paving', 'roofing', 'concrete work', 'insulation'],
  '47-50': ['mining', 'oil drilling', 'gas extraction', 'blasting', 'heavy equipment operation', 'mineral extraction'],
  // 49: Installation, Maintenance, Repair
  '49-10': ['maintenance supervision', 'repair oversight', 'crew management', 'work order management', 'quality assurance'],
  '49-20': ['electrical repair', 'electronics maintenance', 'circuit troubleshooting', 'equipment installation', 'wiring repair'],
  '49-30': ['vehicle repair', 'engine diagnostics', 'brake service', 'transmission repair', 'preventive maintenance', 'auto mechanics'],
  '49-90': ['equipment repair', 'maintenance', 'troubleshooting', 'installation', 'preventive maintenance', 'technical service'],
  // 51: Production
  '51-10': ['production supervision', 'manufacturing management', 'quality control oversight', 'shift management', 'production scheduling'],
  '51-20': ['assembly', 'fabrication', 'component assembly', 'quality inspection', 'hand tools', 'production line'],
  '51-30': ['food processing', 'food safety', 'production machinery', 'quality control', 'packaging', 'sanitation'],
  '51-40': ['metalworking', 'machining', 'welding', 'metal fabrication', 'precision cutting', 'cnc operation'],
  '51-50': ['printing', 'press operation', 'binding', 'typesetting', 'print finishing', 'color management'],
  '51-60': ['textile production', 'sewing', 'garment manufacturing', 'fabric cutting', 'pattern making', 'upholstery'],
  '51-70': ['woodworking', 'cabinetmaking', 'wood cutting', 'furniture making', 'lumber processing', 'wood finishing'],
  '51-80': ['plant operation', 'system monitoring', 'process control', 'power generation', 'water treatment', 'chemical processing'],
  '51-90': ['production work', 'manufacturing', 'machine operation', 'quality inspection', 'packaging', 'material handling'],
  '51-91': ['machine operation', 'machine tending', 'equipment monitoring', 'production processing', 'setup adjustment'],
  // 53: Transportation & Material Moving
  '53-10': ['transportation supervision', 'fleet management', 'logistics coordination', 'dispatch management', 'route planning'],
  '53-20': ['aviation', 'flight operations', 'aircraft systems', 'navigation', 'air safety', 'aeronautics'],
  '53-30': ['driving', 'vehicle operation', 'route navigation', 'traffic safety', 'freight transport', 'delivery'],
  '53-40': ['rail operations', 'train operation', 'locomotive engineering', 'rail safety', 'switching', 'signal systems'],
  '53-50': ['marine operations', 'vessel navigation', 'marine safety', 'waterway transportation', 'deck operations', 'seamanship'],
  '53-60': ['transportation operations', 'vehicle operation', 'passenger service', 'navigation', 'transit operations'],
  '53-70': ['material moving', 'forklift operation', 'loading', 'unloading', 'warehouse operations', 'freight handling'],
};

// ─── Resolve sub-group code from SOC code ────────────────────────────────────

function resolveSubGroup(socCode: string): string {
  const full5 = socCode.substring(0, 5); // e.g. "15-13"
  if (SUB_GROUP_TEMPLATES[full5]) return full5;

  // Fallback to XX-X0 (major sub-group)
  const broad = full5.substring(0, 4) + '0';
  if (SUB_GROUP_TEMPLATES[broad]) return broad;

  // Fallback to major group (XX-10 or XX-90)
  const majorGroup = socCode.substring(0, 2);
  const fallback10 = `${majorGroup}-10`;
  const fallback90 = `${majorGroup}-90`;
  if (SUB_GROUP_TEMPLATES[fallback10]) return fallback10;
  if (SUB_GROUP_TEMPLATES[fallback90]) return fallback90;

  return '';
}

// ─── Generate metadata for a single occupation ───────────────────────────────

export function generateMetadata(socCode: string, title: string, educationLevel: string): OccupationMetadata {
  const titleLower = title.toLowerCase();

  // 1. Start with sub-group template
  const subGroupKey = resolveSubGroup(socCode);
  const template = SUB_GROUP_TEMPLATES[subGroupKey];

  if (!template) {
    // Absolute fallback
    return {
      careerCluster: 'business',
      workEnvironment: { setting: ['office'], schedule: ['standard'], physicalDemands: 'light', travelRequired: 'none' },
      skills: { analytical: 5, creative: 5, social: 5, technical: 5, leadership: 5, physical: 5, detail: 5 },
      workStyle: { independence: 'mixed', structure: 'moderate', variety: 'moderate', pace: 'moderate', peopleInteraction: 'moderate' },
      values: ['stability'],
      outlook: { growth: 'stable', automationRisk: 'medium' },
      keywords: titleLower.split(/[\s,&]+/).filter(w => w.length > 3),
    };
  }

  // Build base metadata from template
  let metadata: OccupationMetadata = {
    careerCluster: template.careerCluster!,
    secondaryClusters: template.secondaryClusters,
    workEnvironment: { ...template.workEnvironment! } as OccupationMetadata['workEnvironment'],
    skills: { ...template.skills! } as OccupationMetadata['skills'],
    workStyle: { ...template.workStyle! } as OccupationMetadata['workStyle'],
    values: [...(template.values || [])],
    outlook: { ...template.outlook! } as OccupationMetadata['outlook'],
    keywords: [...(template.keywords as string[] || []), ...(SUB_GROUP_BASE_KEYWORDS[subGroupKey] || [])],
  };

  // 2. Apply all matching title-keyword overrides (word-boundary aware)
  for (const [pattern, override] of Object.entries(TITLE_KEYWORD_MAP)) {
    const pat = pattern.toLowerCase();
    // Use word-boundary regex to avoid "logist" matching "technologist" etc.
    const regex = new RegExp(`(?:^|\\b|\\s)${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (regex.test(titleLower)) {
      metadata = deepMergeMetadata(metadata, override);
    }
  }

  // 3. Generate base keywords from title words
  const titleWords = titleLower
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['all', 'other', 'misc', 'except'].includes(w));

  metadata.keywords = Array.from(new Set([...metadata.keywords, ...titleWords]));

  // 4. Adjust for education level
  if (['DD', 'DOCT', 'MD+'].includes(educationLevel)) {
    metadata.skills.analytical = Math.max(metadata.skills.analytical, 8);
    if (!metadata.values.includes('prestige')) metadata.values.push('prestige');
  }
  if (['BD', 'BD+', 'MD', 'MD+'].includes(educationLevel)) {
    metadata.skills.analytical = Math.max(metadata.skills.analytical, 7);
  }

  // 5. Title-based adjustments for "supervisor" / "manager" / "director" titles
  if (titleLower.includes('supervisor') || titleLower.includes('manager') || titleLower.includes('director')) {
    metadata.skills.leadership = Math.max(metadata.skills.leadership, 8);
    metadata.workStyle.peopleInteraction = 'extensive';
    if (!metadata.values.includes('leadership')) metadata.values.push('leadership');
  }

  // "Helper" or "Assistant" titles
  if (titleLower.includes('helper') || titleLower.includes('aide') || titleLower.includes('assistant')) {
    metadata.skills.leadership = Math.min(metadata.skills.leadership, 3);
    metadata.workStyle.independence = 'team';
    metadata.workStyle.structure = 'highly_structured';
  }

  // "All Other" catch-all titles - ensure we still have decent keywords
  if (titleLower.includes('all other')) {
    // These are grab-bag categories; ensure variety flag
    metadata.workStyle.variety = 'high_variety';
  }

  return metadata;
}

// ─── Main execution ──────────────────────────────────────────────────────────

function main() {
  const occupationsPath = path.resolve(__dirname, '../src/data/occupations.json');
  const occupations: Occupation[] = JSON.parse(fs.readFileSync(occupationsPath, 'utf-8'));

  console.log(`Processing ${occupations.length} occupations...`);

  let updated = 0;
  let noTemplate = 0;

  for (const occ of occupations) {
    const newMetadata = generateMetadata(occ.socCode, occ.title, occ.educationLevel);
    occ.metadata = newMetadata;
    updated++;

    const subGroupKey = resolveSubGroup(occ.socCode);
    if (!subGroupKey) {
      noTemplate++;
      console.warn(`  ⚠ No sub-group template for: ${occ.socCode} - ${occ.title}`);
    }
  }

  // Write back
  fs.writeFileSync(occupationsPath, JSON.stringify(occupations, null, 2), 'utf-8');

  console.log(`\n✓ Updated ${updated} occupations`);
  if (noTemplate > 0) {
    console.log(`⚠ ${noTemplate} occupations fell back to absolute default (missing sub-group)`);
  }

  // Stats
  const clusterCounts: Record<string, number> = {};
  for (const occ of occupations) {
    const c = occ.metadata?.careerCluster || 'unknown';
    clusterCounts[c] = (clusterCounts[c] || 0) + 1;
  }
  console.log('\nCluster distribution:');
  for (const [cluster, count] of Object.entries(clusterCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cluster}: ${count}`);
  }

  // Check keyword richness
  const avgKeywords = occupations.reduce((sum, o) => sum + (o.metadata?.keywords?.length || 0), 0) / occupations.length;
  const withCerts = occupations.filter(o => o.metadata?.certifications && o.metadata.certifications.length > 0).length;
  console.log(`\nAvg keywords per occupation: ${avgKeywords.toFixed(1)}`);
  console.log(`Occupations with certifications: ${withCerts}/${occupations.length}`);
}

// Only run main when executed directly (not when imported)
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url).includes(path.basename(process.argv[1]));
if (isDirectRun) {
  main();
}
