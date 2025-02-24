import { IsNotEmpty, IsString } from "class-validator";

export class CreateTeamRequestDto {
	@IsNotEmpty()
	@IsString()
	team_name: string;
	
	@IsNotEmpty()
    @IsString()
	location: string;
	
}
