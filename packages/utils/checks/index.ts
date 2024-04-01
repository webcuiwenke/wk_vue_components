export const password = {
    pattern:
        /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z_!@#$%^&*`~()-+=/?]+$)(?![a-z0-9]+$)(?![a-z_!@#$%^&*`~()-+=/?]+$)(?![0-9_!@#$%^&*`~()-+=/?]+$)[a-zA-Z0-9_!@#$%^&*`~()-+=/?]{8,30}$/,
    message: "由大小写字母数字部分特殊字符三种组成至少8位",
};

export const mobile = {
    pattern: /^[1][0-9][0-9]{9}$/,
    message: "手机号码格式不对",
};

export const tel = {
    pattern: /^[0-9]{3,4}-[0-9]{7,8}$/,
    message: "请输入正确的电话号码格式",
};

export const chinaText = {
    pattern: /^[^\u4e00-\u9fa5]+$/,
    message: "不能有中文汉子",
};

export const telAndMobild = {
    pattern: /(^[0-9]{3,4}-[0-9]{7,8}$)|(^[1][0-9][0-9]{9}$)/,
    message: "请输入正确的电话号码格式19951977401或0000-00000000",
};

export const number = {
    pattern: /^\d{0,}$/,
    message: "只能输入正整数",
};

export const numberAndPoint2 = {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: "只能输入正整数最多2位小数字",
};

export const engAndNumChart = {
    pattern: /^[a-zA-Z0-9]+$/,
    message: "只能输入英文大小写或数字",
};

export const url = {
    pattern:
        /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/,
    message: "请输入正确的url",
};

export const ip = {
    pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    message: "请输入正确的ip",
};

export const email = {
    type: "email",
    message: "请输入正确的邮箱地址",
    trigger: "blur",
};

export const identityNo = {
    pattern: /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/,
    message: "身份证号长度为18位数字或字母",
};
export const inputLength = {
    pattern: /^.{5,20}$/,
    message: "输入长度必须为5到20个字符",
};
