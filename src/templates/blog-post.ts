import { FC, createElement as h } from "react";
import { Typography, useTheme, makeStyles } from "@material-ui/core";
import { Link, graphql } from "gatsby";
import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Author from "../components/author";
import Popular from "../components/popular";
import { scale } from "../utils/typography";
import { GatsbyImageProps } from "gatsby-image";

const useStyles = makeStyles(theme => ({
  line: {
    marginBottom: theme.spacing(1),
  },
  date: {
    marginBottom: theme.spacing(1),
  },
  navList: {
    display: `flex`,
    flexWrap: `wrap`,
    justifyContent: `space-between`,
    listStyle: `none`,
    padding: 0,
  },
}));

interface Props {
  data: any;
  location: Location;
  pageContext: any;
}

type Email = string;

const BlogPostTemplate: FC<Props> = ({ data, pageContext, location }) => {
  // TODO: Make this type autogenerated, or accessible elsewhere.
  const post: {
    id: string;
    excerpt: string;
    html: string;
    frontmatter: {
      title: string;
      date: string;
      description: string;
      author?: {
        id: Email;
        first?: string;
        last?: string;
        bio?: string;
        image?: {
          childImageSharp: GatsbyImageProps;
        };
      };
    };
    tags: ReadonlyArray<string>;
  } = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;
  const { author } = post.frontmatter;
  const classes = useStyles();

  return h(
    Layout,
    {
      location,
      title: siteTitle,
    },
    h(SEO, {
      title: post.frontmatter.title,
      description: post.frontmatter.description || post.excerpt,
    }),
    h(
      "article",
      null,
      h(
        "header",
        null,
        author?.first && h(Author, author),
        h(
          Typography,
          {
            style: { marginTop: "1rem" },
            variant: "h1",
          },
          post.frontmatter.title,
        ),
        h(
          "p",
          {
            className: classes.date,
            style: {
              ...scale(-1 / 5),
            },
          },
          post.frontmatter.date,
        ),
      ),
      h(Typography, {
        variant: "body1",
        dangerouslySetInnerHTML: {
          __html: post.html,
        },
      }),
      h("hr", { className: classes.line }),
      h(
        "footer",
        null,
        author?.first && h(Bio, {
          name: author.first,
          email: author.id,
          bio: author.bio,
        }),
      ),
    ),
    h(
      "nav",
      null,
      h(
        "ul",
        { className: classes.navList },
        h(
          "li",
          null,
          previous &&
            h(
              Link,
              {
                to: previous.fields.slug,
                rel: "prev",
              },
              "\u2190 ",
              previous.frontmatter.title,
            ),
        ),
        h(
          "li",
          null,
          next &&
            h(
              Link,
              {
                to: next.fields.slug,
                rel: "next",
              },
              next.frontmatter.title,
              " \u2192",
            ),
        ),
      ),
    ),
    h(
      "footer",
      null,
      h(
        Typography,
        { variant: "body2" },
        "This article is provided for informational purposes only and does not create a lawyer-client relationship with the reader. It is not legal advice and should not be regarded as such. Any reliance on the information is solely at the reader’s own risk. ",
        h(
          "a",
          { href: "https://clausehound.com/documents" },
          "Clausehound.com",
        ),
        " is a legal tool geared towards entrepreneurs, early-stage businesses and small businesses alike to help draft legal documents to make businesses more productive.",
      ),
      h(Popular),
    ),
  );
};

export default BlogPostTemplate;
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        author {
          id
          first
          last
          bio
          image {
            childImageSharp {
             fluid(maxWidth: 320, maxHeight: 320) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        tags
      }
    }
  }
`;
