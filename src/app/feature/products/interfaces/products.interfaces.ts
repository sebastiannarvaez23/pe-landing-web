import type { PageSection, RelatedLink } from '../../../core/interfaces/site.interfaces';

export interface ProductPageContent {
  readonly slug: string;
  readonly path: string;
  readonly crumb: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly kicker: string;
  readonly title: string;
  readonly lead: string;
  readonly scope: readonly string[];
  readonly sections: readonly PageSection[];
  readonly related: readonly RelatedLink[];
}
