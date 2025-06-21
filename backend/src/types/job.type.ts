import { Job, Queue } from "bullmq";

// Job Data typings
export interface DueReminderJobData {
    email: string;
    leaseAgreement: any;
}

export interface ResetPasswordJobData {
    email: string;
    token: string;
}

export interface AssignedWorkerJobData {
    email: string;
    maintenance: any;
    token: string;
}

type JobDataMap = {
    dueReminder: DueReminderJobData;
    resetPassword: ResetPasswordJobData;
    assignedWorker: AssignedWorkerJobData;
}

type JobName = keyof JobDataMap;
   
export type TypedEmailQueue = Queue<JobDataMap[JobName], any, JobName>;