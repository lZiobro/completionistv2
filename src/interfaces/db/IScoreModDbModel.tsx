export interface IScoreModDbModel {
  // id    Int     @id @default(autoincrement())
  mod: string;
  score_id: number;
  // user_score UserScore @relation(fields: [score_id], references: [id])
}
