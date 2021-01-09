import { IBaseRepository } from './base.repository.interface';
import { DeleteResult, Repository } from 'typeorm';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async create(data: T | any): Promise<T> {
    return this.entity.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    return this.entity.findOne(id);
  }

  public async findByCondition(filterCondition: any): Promise<T> {
    return this.entity.findOne({ where: filterCondition });
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return this.entity.find(relations);
  }

  public async findAll(): Promise<T[]> {
    return this.entity.find();
  }

  public async remove(id: string): Promise<DeleteResult> {
    return this.entity.delete(id);
  }
}
