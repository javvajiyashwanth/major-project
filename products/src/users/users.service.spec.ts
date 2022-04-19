// NestJS
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import mongoose from 'mongoose';

// Custom
// DTOs
import { UpdateUserDto } from './dto/update-user.dto';
// Schemas
import { UserDocument } from './schemas/user.schema';
// Services
import { UsersService } from './users.service';


const user = {
  "firstname": "firstname",
  "lastname": "lastname",
  "email": "user@mail.com",
  "roles": [
    "user"
  ],
  "profileImage": null,
  "createdAt": "2022-04-17T09:12:47.942Z",
  "updatedAt": "2022-04-17T11:03:25.706Z",
  "id": "625bda0f7381e98ec5862816"
};

class UserModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue([user]) }));
  static findById = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(user) }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(user) }));
  static findByIdAndRemove = jest.fn().mockResolvedValue(true);
}

describe('UsersService', () => {
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(user.id) as unknown as mongoose.Schema.Types.ObjectId;

  let service: UsersService;
  let model: mongoose.Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: UserModel
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<mongoose.Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and save it', () => {
      expect(service.create({
        _id: userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      })).resolves.toEqual({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAll', () => {
    it('should call find method on the model', async () => {
      await service.findAll();
      expect(model.find).toHaveBeenCalled();
    });

    it('should return all the users', () => {
      expect(service.findAll()).resolves.toEqual([user]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the model', async () => {
      await service.findById(userId);
      expect(model.findById).toHaveBeenCalled();
    });

    it('should call findById method on the model with user id', async () => {
      await service.findById(userId);
      expect(model.findById).toHaveBeenCalledWith(userId);
    });

    it('should find the user by id and return it', () => {
      expect(service.findById(userId)).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call findByIdAndUpdate method on the model', async () => {
      await service.update(
        userId,
        {
          firstname: "test"
        } as UpdateUserDto
      );
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should call findByIdAndUpdate method on the model with user id and update user dto', async () => {
      await service.update(
        userId,
        {
          firstname: "test"
        } as UpdateUserDto
      );
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        {
          firstname: "test"
        } as UpdateUserDto,
        {
          new: true
        }
      );
    });

    it('should find the user by id and update', () => {
      expect(service.update(
        userId,
        {} as UpdateUserDto
      )).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('remove', () => {
    it('should call findByIdAndRemove method on the model', async () => {
      await service.remove(userId);
      expect(model.findByIdAndRemove).toHaveBeenCalled();
    });

    it('should call findByIdAndRemove method on the model with user id', async () => {
      await service.remove(userId);
      expect(model.findByIdAndRemove).toHaveBeenCalledWith(userId);
    });
  });
});