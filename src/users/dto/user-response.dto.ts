import { UserRole } from '../entities/user-role.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  location: string | undefined;

  constructor(user: User) {
    this.id = user.user_id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.location = user.location;
  }
}
