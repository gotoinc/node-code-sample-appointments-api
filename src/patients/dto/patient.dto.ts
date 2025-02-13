export class PatientDto {
  id: number;
  user_id: number;
  date_of_birth: Date;
  gender: string;
  address: string | null;
  created_at: Date;
  updated_at: Date;
}
