import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import eProfessionalType from 'src/professional/enums/professional-type.enum';

@Entity('professionals')
export class Professional extends BaseEntity {
  @Column()
  name: string;

  @Column({ length: 100, nullable: false, unique: true })
  code: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: eProfessionalType,
    default: eProfessionalType.DOCTOR,
  })
  type: eProfessionalType;
}
