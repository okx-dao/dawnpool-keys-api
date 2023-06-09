import { EntityRepository } from '@mikro-orm/knex';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';

export class ExitSignatureRepository extends EntityRepository<ExitSignatureEntity> {}
