import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserJwt } from "../decorators/User.decorator";

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const user = req.user as UserJwt;
        
        if(!user) {
            throw new Error('JwtAuthGuard needs to be used in order for TenantGuard to work')
        }

        if(user.role !== 'tenant') {
            return false
        }

        return true
    }
}