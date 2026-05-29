import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.getOrThrow('KEYCLOAK_URL')}/realms/${config.getOrThrow('KEYCLOAK_REALM')}/protocol/openid-connect/certs`,
      }),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const realmRoles: string[] = payload.realm_access?.roles ?? [];
    const role = realmRoles.includes('TEACHER') ? 'TEACHER' : 'STUDENT';

    const exists = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });

    if (!exists) {
      const fullName =
        [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
        null;

      await this.prisma.user.create({
        data: {
          id: payload.sub,
          username: payload.preferred_username,
          email: payload.email ?? `${payload.preferred_username}@local`,
          name: fullName,
          role: role as 'TEACHER' | 'STUDENT',
        },
      });
    }

    return { userId: payload.sub, username: payload.preferred_username, role };
  }
}
