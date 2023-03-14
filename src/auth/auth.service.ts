import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Jwtpayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,

    private readonly confiService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let { password, ...userData } = createUserDto;

      userData.email = userData.email.toLowerCase();

      let user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      // To not see a password in a request
      user.password = undefined;

      return {
        user,
        token: this.getJwtToken({ id: user._id }),
      };
      // TODO: return JWT
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `The user with email ${createUserDto.email} already exist`,
        );
      }
      console.log(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel
      .findOne({ email })
      .select(['name', , 'lastname', 'email', 'rol', 'password']);

    if (!user) {
      throw new UnauthorizedException(`Credentials are no valid`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(`Credentials are no valid`);
    }

    user.password = undefined;

    return {
      user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  private getJwtToken(payload: Jwtpayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
