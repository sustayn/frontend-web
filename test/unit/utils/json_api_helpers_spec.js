import { expect } from 'chai';
import {
    serializeJsonApiRecord,
    deserializeJsonApiErrors,
} from 'utils/jsonApiHelpers';

describe('Utils | JsonApiHelpers', function() {
    describe('serializeJsonApiRecord', function() {
        it('properly serializes the record to kebab case type', function() {
            const serialized = serializeJsonApiRecord({ type: 'myCamelCase' }, { attrOne: 'foo', attrTwo: 'bar' });
            expect(serialized).to.deep.equal({
                data: {
                    type: 'my-camel-case',
                    attributes: {
                        'attr-one': 'foo',
                        'attr-two': 'bar',
                    },
                },
            });
        });

        it('will serialize relationships passed in as {relationship}Id', function() {
            const serialized = serializeJsonApiRecord({ type: 'myType' }, { attrOne: 'foo', myRelId: 42 });
            expect(serialized).to.deep.equal({
                data: {
                    type: 'my-type',
                    attributes: {
                        'attr-one': 'foo',
                    },
                    relationships: {
                        'my-rel': {
                            data: {
                                type: 'my-rels',
                                id: 42,
                            },
                        },
                    },
                }
            });
        });
    });

    describe('deserializeJsonApiErrors', function() {
        it('returns an empty object if the errors array doesnt exist', function() {
            const deserialized = deserializeJsonApiErrors(undefined);
            expect(deserialized).to.deep.equal({});
        });

        it('returns an empty object if the errors array is empty', function() {
            const deserialized = deserializeJsonApiErrors([]);
            expect(deserialized).to.deep.equal({});
        });

        it('correctly deserializes json api errors', function() {
            const key = 'first-name';
            const detail = 'is required';
            const errArray = [{
                source: { pointer: `/data/attributes/${key}` },
                detail,
            }];

            const deserialized = deserializeJsonApiErrors(errArray);
            expect(deserialized).to.deep.equal({ firstName: detail });
        });

        it('skips an error if it doesnt have source.pointer', function() {
            const key = 'first-name';
            const detail = 'is required';
            const errArray = [{
                title: 'An error',
                detail: 'My detailed error',
            }];

            const deserialized = deserializeJsonApiErrors(errArray);
            expect(deserialized).to.deep.equal({});
        });

        it('skips an error if it doesnt have detail', function() {
            const key = 'first-name';
            const detail = 'is required';
            const errArray = [{
                title: 'An error',
                source: { pointer: '/data/attributes/first-name' },
            }];

            const deserialized = deserializeJsonApiErrors(errArray);
            expect(deserialized).to.deep.equal({});
        });
    });
});