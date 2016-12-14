const posts = [
  { title: 'Post 1', content: 'fake content'},
  { title: 'Post 2', content: 'fake content'},
];

const getPosts = () => new Promise(resolve => setTimeout(() => resolve(posts), 1000));

const printPostsToConsole = () => getPosts().then(posts => console.log(posts));

printPostsToConsole();

async function printPostsToConsole2() {
  const posts = await getPosts();
  console.log(posts);
};

printPostsToConsole2();