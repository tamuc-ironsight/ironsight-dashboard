import React from "react";
import { useQuery } from "react-query";
import { getNewsList } from "../../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";

const NewsWidget = () => {
  const { data, isLoading, isError } = useQuery("news_list", getNewsList);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  var articles = data.articles;
  var news_list = articles.map(function (article) {
    return (
      <tr key={article.title} className="hover">
        <td>
          <a
            href={article.link}
            className="break-normal whitespace-normal"
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.title}
          </a>
        </td>
      </tr>
    );
  });

  return (
    <div className="overflow-auto">
      <table className="table w-full">
        <tbody>{news_list}</tbody>
      </table>
    </div>
  );
};

export default NewsWidget;
