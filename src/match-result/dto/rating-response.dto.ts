export class RatingResponseDto {
  matchId: number;
  matchDate: Date;
  before: number;
  after: number;

  constructor(partial: Partial<RatingResponseDto>) {
    Object.assign(this, partial);
  }
}