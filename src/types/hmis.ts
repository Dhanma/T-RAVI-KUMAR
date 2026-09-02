export type IndicatorCategory = 
  | 'maternal_health'
  | 'delivery_care'
  | 'child_immunization'
  | 'family_planning'
  | 'opd_ipd_services'
  | 'disease_surveillance'
  | 'diagnostics_lab';

export interface BlockBreakdown {
  blockName: string;
  april: number;
  may: number;
  june: number;
  total: number;
}

export interface HMISIndicator {
  id: string;
  code: string; // e.g. "M.1.1", "C.2.3"
  name: string;
  nameHindi?: string;
  category: IndicatorCategory;
  unit: 'number' | 'percentage' | 'ratio' | 'rate_per_thousand';
  april2026: number;
  may2026: number;
  june2026: number;
  q1Total: number;
  q1Target: number;
  annualTarget: number;
  achievementPercent: number; // (q1Total / q1Target) * 100
  status: 'achieved' | 'on_track' | 'lagging' | 'critical';
  benchmarkNational?: number;
  description?: string;
  blockData?: BlockBreakdown[];
}

export interface OfficialFacility {
  slNo: number;
  subDistrict: 'Mayabunder' | 'Diglipur' | 'Rangat';
  block: 'Mayabunder' | 'Diglipur' | 'Rangat';
  facilityName: string;
  facilityType: 'District Hospital (DH)' | 'Sub-Divisional Hospital (SDH)' | 'Community Health Centre (CHC)' | 'Primary Health Centre (PHC)' | 'Ayushman Arogya Mandir (AAM)' | 'Sub-Centre (SC)';
}

export interface FacilityReportStatus {
  facilityType: 'District Hospital (DH)' | 'Sub-Divisional Hospital (SDH)' | 'Community Health Centre (CHC)' | 'Primary Health Centre (PHC)' | 'Health & Wellness Centre (AAM/SC)';
  totalFacilities: number;
  reportedFacilities: number;
  reportingRatePercent: number;
  timelyReportingPercent: number;
}

export interface DistrictMetadata {
  state: string;
  district: string;
  reportingQuarter: 'Q1 (April - June 2026)';
  financialYear: '2026-2027';
  reportGeneratedDate: string;
  officerInCharge: string;
  designation: string;
  totalPopulation: number;
  estimatedTargetPregnantWomen: number;
  estimatedInfants: number;
  dataApprovalStatus: 'Approved by CMO' | 'Draft' | 'Under Verification';
}

export interface HMISDataset {
  metadata: DistrictMetadata;
  facilityStatus: FacilityReportStatus[];
  indicators: HMISIndicator[];
  officialFacilities?: OfficialFacility[];
}

