import { Entity, Column } from 'typeorm';
import BaseEntity from './BaseEntity.js';

@Entity({
  name: 'api_keys',
})
class ApiKey extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public name: string;

  @Column({ nullable: false, type: 'varchar' })
  public description: string;

  @Column({ nullable: false, type: 'varchar', unique: true })
  public slug: string;

  @Column({ nullable: false, type: 'varchar', unique: true })
  public key: string;
}

export default ApiKey;
