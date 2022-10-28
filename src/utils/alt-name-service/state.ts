import { Connection, PublicKey } from '@solana/web3.js';
import { deserializeUnchecked, Schema } from 'borsh';

/**
 * Holds the data for the {@link NameRecordHeader} Account and provides de/serialization
 * functionality for that data
 */
export class NameRecordHeader {
    constructor(obj: {
        parentName: Uint8Array;
        owner: Uint8Array;
        nclass: Uint8Array;
    }) {
        this.parentName = new PublicKey(obj.parentName);
        this.owner = new PublicKey(obj.owner);
        this.nclass = new PublicKey(obj.nclass);
    }

    parentName: PublicKey;
    owner: PublicKey;
    nclass: PublicKey;
    data: Buffer | undefined;

    static DISCRIMINATOR = [68, 72, 88, 44, 15, 167, 103, 243];
    static HASH_PREFIX = 'ALT Name Service';

    /**
     * NameRecordHeader Schema across all name service accounts
     */
    static schema: Schema = new Map([
        [
            NameRecordHeader,
            {
                kind: 'struct',
                fields: [
                    ['discriminator', [8]],
                    ['parentName', [32]],
                    ['owner', [32]],
                    ['nclass', [32]],
                    ['padding', [96]],
                ],
            },
        ],
    ]);

    /**
     * Returns the minimum size of a {@link Buffer} holding the serialized data of
     * {@link NameRecordHeader}
     */
    static get byteSize() {
        return 8 + 32 + 32 + 32 + 96;
    }

    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link NameRecordHeader} from its data.
     */
    public static async fromAccountAddress(
        connection: Connection,
        nameAccountKey: PublicKey,
    ): Promise<NameRecordHeader | undefined> {
        const nameAccount = await connection.getAccountInfo(
            nameAccountKey,
            'confirmed',
        );
        if (!nameAccount) {
            return undefined;
        }

        const res: NameRecordHeader = deserializeUnchecked(
            this.schema,
            NameRecordHeader,
            nameAccount.data,
        );

        res.data = nameAccount.data?.subarray(this.byteSize);

        return res;
    }

    /**
     * Returns a readable version of {@link NameRecordHeader} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty() {
        return {
            parentName: this.parentName.toBase58(),
            owner: this.owner.toBase58(),
            nclass: this.nclass.toBase58(),
        };
    }
}