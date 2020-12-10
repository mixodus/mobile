import { ShellModel } from '../shell/data-store';

export class JobsModel extends ShellModel {
  status: boolean;
  message: string;
  data: Jobs[] = [];

  constructor() {
    super();
  }
}

export interface JobsInterface {
  status: boolean;
  message: string;
  data: Jobs[];
  isShell: boolean;
}

export interface Jobs {
  jobId: string;
  companyName: string;
  jobTitle: string;
  designationName: string;
  jobTypeName: string;
  jobVacancy: string;
  dateOfClosing: string;
  status: boolean;
  createdAt: string;
  companyLogoUrl: string;
  province: string;
  country: string;
}

export const initialJobsState: Jobs = {
  jobId: '',
  companyName: '',
  jobTitle: '',
  designationName: '',
  jobTypeName: '',
  jobVacancy: '',
  dateOfClosing: '',
  status: false,
  createdAt: '',
  companyLogoUrl: '',
  province: '',
  country: ''
};
