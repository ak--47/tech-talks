
  

# SQL: and you

## wat

`SQL` (structured query language) is the most popular "language" used to query [relational databases](https://www.oracle.com/database/what-is-a-relational-database/). Relational databases are the most popular form of database for any type of software application. And they have been [for over 30 years](https://blog.sqlizer.io/posts/sql-43/).

Relational databases model raw data as *tables*, essentially columns and rows:

| id |name | age |
|--|--|--|
| 1 | AK | 34 |
| 2 | Alice | 27 |
| 3 | Bob | 42 |
| 4 | Eve |3 |

*Columns* are **attributes** (_id_, _name_, _age_), *rows* are **instances** (_individual people_). In this way, each "box" in the table is a  `cell` ... therefore the `# of cells` in our database is always equal to `# of rows * # of columns`

Most tables in SQL have a single `primary_key` column (think `$insert_id` in mixpanel) which contains a unique value for each row, that identifies that particular row. Tables may have multiple `id` columns; any column after the first one is known as a `foreign_key`. More on this later.

SQL scales to (almost) any number of rows, columns, and cells.

Recall that databases add **persistence** to software applications. HTTP is *not* inherently stateful, and so databases are mission critical applications components that are required to make any kind of meaningful software.

You might use a database for: 

 - end-user authentication + account creation
 - handling data uploaded or posted by the end-users
 - logging actions preformed by end-users
 - receipts, orders, and any records that a business needs to "save"
 - any other "state" that we can't rely on HTTP for

For these use-cases, the primary operations you might preform against a database are:

- `CREATE` : add a row
- `READ` : read a cell/row
- `UPDATE` : update a cell
- `DELETE` : delete a row 
(this paradigm is typically referred to as [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete))

Since "the database" (in production) is often the source of truth for all things, you might *also* use a database for:

- analytics questions
- business intelligence
- data driven apps / internal tools

For these use-cases, the primary operations you might preform are:

- `QUERY` : a statement to "go get" a piece of raw data (similar to `READ` with biz logic)
- `AGGREGATE` : functions like `sum()` and `count()` which do math
- `JOIN` : bring two tables together, so you can then `query` and `aggregate` 

Because these *types of operations* are so different, there exist two major flavors of optimizations for SQL databases: **OLTP** + **OLAP**:

*OLTP: Online Transaction Processing*
Databases optimized for creating or writing records. Typically used to support applications in production, when the database needs to store new content that’s created by users inside the application. And it needs to do this _quickly_ with **no down time**.

*OLAP: Online Analytical Processing*
Databases optimized for reading or querying records. These types of databases are typically used for analysis. Often, an OLAP will support a query language that allows data engineers to ask questions about their data.

So, to summarize, in SQL, you can *either*:
- write data quickly
OR
- read data quickly

you can't have it both ways.

But businesses WANT to have it both ways! The solution: a **data warehouse**

## Data Warehouses

A data warehouse has one job: **create a copy of production, so we can run business queries without impacting our app's performance**

There are four major flavors of data warehouses:
	- BigQuery (by Google)
	- Redshift (by Amazon)
	- Azure (by Microsoft)
	- Snowflake (by Snowflake)

note: snowflake runs _on top of_ one of the big 3.

Data warehouses take the "headaches" (i.e. migrations) of moving data from OLTPs to OLAPs... essentially, they make it so *you don't have to build any infrastructure* to go from an app in production to a corollary SQL environment where you can ask questions about what happened in production. That is their value proposition and the market has validated this time and again.

However, a data warehouse doesn't really do anything for you, other than create copies of your data with good infrastructure. You still have to ask the questions. And to do so, you need to translate them from "plain English" INTO a query language.

Enter SQL, the language.

## The SQL "language"

most SQL statements look like this:

```
SELECT
	{{some columns}}
FROM
	{{some table}}
WHERE
	{{some condition}}
LIMIT
	{{restrain # of results}}
```

SQL has **statements**, like `SELECT`, `WHERE`, and `FROM`

SQL has **functions** like `sum()`, `count()`, and `distinct()`

SQL has **operators** like `=`, `>`, `<`, `IS`, `IN`, and `LIKE`

These all get used together to express a piece of business logic.

For example, in our [meTube Comments](https://console.cloud.google.com/bigquery?project=mixpanel-expert&d=salesEngineers&p=mixpanel-gtm-training&page=table&t=meTube-comments) dataset we might say:

```
SELECT
	who, video, emotion
FROM
	`mixpanel-gtm-training.salesEngineers.meTube-comments`
WHERE
	emotion="envy" AND rating >  6
LIMIT
	5
```

And get back this table:

![enter image description here](https://aktunes.neocities.org/sql%20result.png)

(go ahead... [try it!](https://console.cloud.google.com/bigquery?sq=1078767167468:d3b1c4fe74f24e4a90c3d410deafbfd7))

SQL has a ton of keywords you can use in analysis:

![you will not need to learn all of these](https://aktunes.neocities.org/sql%20things.png)

All SQL queries are a combination of these statements executed against a SQL database.

This does not "build a chart" or do any analysis for you. You put in a SQL query and you get back a table. That is the flow.

You are armed with the basic knowledge... now it's time to experiment.

## tools


- [Carvis](https://www.npmjs.com/package/carvis): for generating fake tabular data


## tutorials


- A very good list of [SQL statements and functions](https://www.w3schools.com/sql/sql_syntax.asp)

