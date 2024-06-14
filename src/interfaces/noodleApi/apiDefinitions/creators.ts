type ApiDefinitions = {
  '/webhooks/creators/{creatorId}': {
    GET: {
      query: void;
      body: void;
      params: { creatorId: string };
      response: {
        id: string;
        name?: string | null;
        slug: string;
        personId?: string | null;
        hasCustomOgImage?: boolean | null;
        stripe_account_id?: string | null;
        successPaymentRedirectUrl?: string | null;
        person: {
          id: string;
          name?: string | null;
          email?: string | null;
          phoneNumber?: string | null;
          image?: {
            url: string;
            mimeType?: string | null;
          } | null;
          primaryColour?: {
            hex: string;
          } | null;
        } | null;
        primaryColour?: {
          hex: string;
        } | null;
        ogImage?: {
          id: string;
          url: string;
          fileName: string;
        } | null;
        productTypes: Array<{
          id: string;
          title?: string | null;
          products: Array<{
            id: string;
            title?: string | null;
            image?: {
              url: string;
            } | null;
          }>;
        }>;
        collection: Array<{
          id: string;
          collectionTitle?: string | null;
        }>;
      };
    };
  };
  '/webhooks/creators/{creatorId}/has-permission': {
    GET: {
      query: {
        personId: string;
        scope: 'is-owner' | 'is-member';
        // scope?: string;
      };
      body: void;
      params: { creatorId: string };
      response: {
        hasPermission: boolean;
      };
    };
  };
};

export default ApiDefinitions;
