import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from '../../users/entities/user.entity';
import { UserRole } from 'src/users/entities/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 핸들러 메서드 또는 클래스에 설정된 역할을 가져오기
        const requireRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 설정된 역할이 없는(==권한설정을 하지 않은) 핸들러는 기본적으로 true를 반환해 접근을 허용
        if (!requireRoles) {
            return true;
        }

        // 요청 객체에서 사용자 정보를 가져오기
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        console.log("User from Request:" + user);
        console.log("Requirement from signs:" + requireRoles);


        // 사용자의 역할이 필요한 역할 목록에 포함되는지 권한 확인
        return requireRoles.some((role) => user.role === role);
    }
}