import {
  PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

abstract class BaseEntity {
  @PrimaryColumn({ default: 'nanoid(25)', length: 25, type: 'varchar' })
  public id: string;

  @CreateDateColumn({ default: 'Now()', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ default: 'Now()', onUpdate: 'Now()', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date | null;
}

export default BaseEntity;
