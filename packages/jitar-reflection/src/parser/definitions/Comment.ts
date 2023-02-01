
const Comment =
{
    SINGLE: "//",
    MULTI_START: "/*",
    MULTI_END: "*/"
};

const Comments = Object.values(Comment);

function isComment(value: string): boolean
{
    return Comments.includes(value);
}

export { Comment, Comments, isComment };
