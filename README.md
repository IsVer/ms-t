### Passive Activism 

#### Environmental shareholder activism and the role of index funds
The increase in passively invested money, index funds, is affecting the relationship between management and shareholders in basically every listed U.S. company. As index funds account for a larger share of the stock market, more voting power lies with the largest fund managers. As activists have been submitting more shareholder proposals on environmental issues, how did this voting power of index funds play out? 
<br><br>
This article is a first look at this question using public voting records of the three largest index fund providers ([Form N-PX](https://www.sec.gov/reportspubs/investor-publications/investorpubsmfproxyvotinghtm.html) filings).  
<br><br> 
[![image](Data/img/screensh.png)](https://isver.github.io/ms-t/)
[Project link](https://isver.github.io/ms-t/)

#### Data source and methodology
Mutual funds and other registered management investment companies vote on behalf of the investors in their funds. In doing so, they have a fiduciary duty that prescribes that asset managers act in the sole interest of their clients (the beneficial owners of the securities), disregarding their own self-interest. How to interpret this "sole interest of the owners"? <br>
As index-based investment providers grew in size, this question became more prominent. Millions of people own mutual funds and exchange traded funds (ETFs), and this number is growing. How do asset managers represent us at shareholder meetings? As fiduciaries, how do they interpret our interests?
<br><br> 
These asset managers need to disclose how they voted on their securities with the Securities and Exchange Commission (SEC). The SEC has a [search function](https://www.sec.gov/edgar/searchedgar/mutualsearch.html) allowing investors to look at voting records for each mutual fund and other investment companies. The interesting filing here is Form N-PX. See [an example of a Form N-PX]( https://www.sec.gov/Archives/edgar/data/36405/000093247118006954/indexfunds0835.html) for Vanguard's index funds.
These text files is the data used for the visual article. Data scraping, cleaning and analysis was done with regex and pandas in python. Each vote is represented in a standardized format, like the example for Alphabet below. <br><br>
![image](Data/img/screensh2.png =250x250)


#### Read more

