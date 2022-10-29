import { v4 as uuidv4 } from 'uuid';
// 通过 uuid 可生成唯一的字符序列，即每次生成的都不一样
// 但此处我们应该保证：在已经有的情况下保证其不发生变化（以此来做标识符），如果没有，则生成一个“持久”（用户可能会不定期查看，因此，要保证已生成的id不消失）的id - 我们使用本地存储解决
export const userId = () => {
    // 先判断本地存储中是否已存在，若存在，则不需要重新生成
    let temporaryId = localStorage.getItem('tem_uuid')
    // 若不存在，则利用 uuidv4 生成一个
    if(!temporaryId) {
        temporaryId = uuidv4();
        // 并存储在本地中
        localStorage.setItem('tem_uuid', temporaryId)
    }
    return temporaryId;
}