import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [posts, setPosts] = useState(postsPagination.results);

  const updatePosts = async () => {
    fetch(postsPagination.next_page).then(response => console.log(response));
  };

  return (
    <>
      <Head>
        <title>Posts | LeoBlog</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div>
                  <p>
                    <span>
                      <FiCalendar />
                    </span>
                    {post.first_publication_date}
                  </p>
                  <p>
                    <span>
                      <FiUser />
                    </span>
                    {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
          {postsPagination.next_page && (
            <h2 onClick={updatePosts}>Carregar mais posts</h2>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 100,
    }
  );
  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  return {
    props: {
      postsPagination: { next_page: postsResponse.next_page, results: posts },
    },
    revalidate: 60 * 60,
  };
};
