import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

export class AddDataCategoryTable1605203262313 implements MigrationInterface {
    categoryRepository = getRepository('category');
    categorySeed = [
        {
            name: 'Customer Journey Maps',
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`,
        },
        {
            name: 'Innovation',
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`,
        },
        {
            name: 'Business model',
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`,
        },
        {
            name: 'Product',
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`,
        },
        {
            name: 'Marketing',
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`,
        },
        {
            name: 'Custom',
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`,
        },
    ];
    public async up(_queryRunner: QueryRunner): Promise<void> {
        await this.categoryRepository.save(this.categorySeed);
    }
    public async down(_queryRunner: QueryRunner): Promise<void> {
        for (const item of this.categorySeed) {
            const category = await this.categoryRepository.findOne({
                where: {
                    name: item.name,
                },
            });

            await this.categoryRepository.remove(category);
        }

        // this.categorySeed.forEach(async (item) => {

        //     promises.push(this.categoryRepository .createQueryBuilder('device')
        //     .delete()
        //     .from(DevicePermissions)
        //     .where('homePermissionId = :homePermissionId', { homePermissionId: permissionOfUser.id })
        //     .execute()
        // })
        // await getRepository('category').save(this.categorySeed);
    }
}
