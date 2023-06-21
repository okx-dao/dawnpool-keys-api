import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
  t,
} from '@mikro-orm/core';

import { ExitSignatureRepository } from '../signature/exit-signature.repository';

@Entity({
  tableName: 'exit_signatures',
  customRepository: () => ExitSignatureRepository,
})
export class ExitSignatureEntity {
  [EntityRepositoryType]?: ExitSignatureRepository;

  @PrimaryKey({ type: t.integer })
  index!: number;

  @Property({ type: t.integer })
  epoch!: number;

  @Property({ type: t.boolean })
  isExited!: boolean;

  @Property({ type: t.text })
  encryptedSignature!: string;
}
