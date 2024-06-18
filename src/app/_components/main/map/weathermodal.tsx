
interface weather{

    weathers:string
}

interface MapProps{
    weather:weather
    weather_function:()=>void;
}

const WeatherModal: React.FC<MapProps> =({weather,weather_function})=>{
    
    const changelocal=()=>{

        let today=new Date().getTime();
        window.localStorage.setItem("daycheck",JSON.stringify(today+86400000));
        

        weather_function();
        
    }

    const deletemodal=()=>{
        const doc=document.getElementById("modal");
        doc.style.display="none";
        
    }
    console.log("weather:",weather)

    return (<div id="modal" className="w-[250px] h-[250px] absolute bg-lime-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   rounded-lg shadow-md z-20">
        <button onClick={()=>deletemodal()} className="absolute w-[25px] h-[25px] border-black border-solid
        border-[1px] text-center text-[10px] top-0 left-0  font-normal"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOMAAADeCAMAAAD4tEcNAAAAkFBMVEUAAAD////l5eXk5OTm5ubj4+Pz8/P39/f09PTw8PD5+fns7Ozt7e3p6en8/Pz4+PjY2NjOzs6YmJiAgIDV1dWSkpKwsLCmpqbIyMi+vr6goKBxcXGOjo7R0dG6urp6enpcXFyGhoZJSUlKSkoUFBRZWVkvLy9paWkaGhpBQUElJSVycnJbW1sYGBg7OzszMzP28ay8AAAWW0lEQVR4nNVd6XrUuBL1vsmSOySEBEiAIQQIM8P7v93Vamu3VO0Oc/3HnxNXS8dSbVKpqijLktRNNdL7XDVNSe7efP/99PTy9/XtqccT/XPTNJje+qqpenrHTVPR20QfO0FU01tJf2Omt5H+mRFVgmjYiBqNCAki1TAlqgn/jQa5RAt9HBhREyBiDbfvfv314+nHz1/v77pR9naQv1HoGJvu6nuhXc/vyf8DRoQ+6r0urucwxqH9VtjXI+1uVXGMdVPzlukz624dwqi+Lse4ETUaURBjhSTRwj6uIFpqidFP1IwfnV5fs7dqjpF+7GKayIIR7shU3jrv0uvbNCI0k4kM9K2B3meEML31goiM9D4RMtHbSB87eu/pHZtEiF46Ef0N2rAiYr+xmES9SyQbXjQi+hPl6cXX7Ydu7S0q6roWH3z85HuXXvRbkrau+ber65Z9O/rIP3hbt/yD1zX/4PSRfzv6VrkRzeJREXX0kc9mQdTvEs2SiI+06C0j4tOjnh8Dvb7deltIbhvG74GXi6KNMc5icmxcOHCMkmMtIo3NR5cFOpPNV9kweucev96tDReS28rr4MsMZFvJcaw4VVtJxqlMxqlqwTgVH5J6JWo1oo7+mXdXsXklGaeqNaK5rsQ4VnIcBVG9ETGMXRhiUdwvsrfFOI7dMEyhIRfXqedvDR19m96GcXuUd+vRfstD5P7GGP8Nl8gvQbahGcTbXK62TRV9mY3k+u3kB5/oF+7cD64GTX7wYSMSwlgQIUFEWnuka0Xkmx42UWSi8uunbFjojvHXDkYK8j+nH/cgcrmz6cd2720Kkn4/KctSxnEbEkVUaUTakASIDHHtHcdpF2LxQzRczPM8lq4Wda9TuSwjfbtfloURTcvS0fuwLBO9zfRxoLeOPrK36Eu9eDSIFi/RIImmKFEviEZBtOxDLIq7kf0Gk6uoTHid8+RYCUlVJ8pVORMNIiUim5BclbqjEixQVV65uj9R2fUdKf04n5IwUpD/Ff04pEEsipFjpJZDKgEVxq1j50xlxM5pfXaOJKpDdo5NNEsi2TDX5u8Se/zAMTKKmP43rpMhIhsuc+j3pz9E6CMXH836wflXoC+bInIlKgXRKImIQaTkKpZEcnpIoqjqN67HUcrV8nMqCQNJLfkdv2MqN7/D0h1pfsfGAl6/Y0wdRWrQjZXE+DWZhoLMxShtgDyMUpR5MWZALN5wjISQ8q90ouLUYYxLQpYGU4+HlDPGDf0NQh/HkpT0vw11tUr6iOhbA33s6SOKEo1+IiyIepMomRc5RtZbJnO6sMvhA5khc7y+VbvjW8VlTs4oFsX7UuqO7ksOGQP553RHlwWRWXPCt0rWHSvIPN+qMhyyRN/KbwPkjWJR3Ky+VaINsIFkPk7f99wBovdRPHLPx33sxKP6cxrR6CXK4kV2TawlbpOPT7kgM2zyOm6T+32rVp8eq02eO4rFB2GTs6bw20xaCvIP+FbZEIurPN/KAZk3jlXeONaeceyzIf6WvhWf8GWeZOUgSQ4/Drn8KN8aNiKSDbF4HHhLcs1qyqZnPPkKcrVVcjV/ohZfO7lmJdXUHQTk6+nHhIUN96LsXSvfinsrKUsBNsgJtIa8Z+f41pDL9/ndu+vVGjJh6/jMbEx2sLbrhlqT1NbEzPRkv0FvzD5cxCMi3PTE1PQkSLzVY256klk8TpKI/cYkiGaNCK9EQ/5ELW7HQbak7emE9gIi1+nCfodkcwAvUojbno7WFGgkL+Q/9uXmP8IgSja3MBIIyMGPsfJj3LMBKo8NkG3AFWxLsdIwqn0rLj5AI7m7ntOetZ4DG0X+vVtr30p8u3xbgIG8pO7IdKYkRGO/V+1bKaMLNJKuDaAvlZ61vgoZxcexkhilDTDPaJymaUAzGugdxpMIzfI3Onof6Z3eeu1xoXckWurovaf3eSMagkQwXrRaEvtW+p4fbLqGbPJ1k6T22OSRTRJhWowA1U8lKmdzOT2Ub7XFrrCxBYzkw0V8qwbIixabN+44AkFuQ6KYD7L/WOm+1QAYxftRyAaNzauicy/IdH2YPD903gWxUR+J54dsuSpEJGy6Ltu3C4xSTjwAbKJabF579KNiHMhIHqsfO8gojmvDln40BGAjBCCUJ6XJYoyjthoix9H0rbxEBOJMDX5xXXCdhKROQkKRITRCRvKqZDoJMZ3EYqSE9kNc+808ZMpoid4W1pJ87EXDM9draILoxUH7Db3hwrItpEycQU7zlWHUWHJV+B2V1B0xS2iouzcAiGPAfPLpR6XqQCAP0Y8wpeFdd9n0o9dBgPDk1WRu+A4ysI2yuQgGqVuhH1VLre4gqF1iCC8ScwlF84HqVeYYukMqa9h0tcWHZqkZMseaVCIkhnYVNlEjJmJAdyxiUoEEz44HvKM7ashEpZ6Gtmbv6I4mGkwLArmL0RQOazAtn80QvcgMuBhGay0MifU0tYBGINO1F+tpi3/VrdtW3dTK3bAt1ZXZWy+UF0vZ29Fd7mNrhFLmhINpgTzpypzKK3Mk4yiZA5qoc3zZto7oDsk4AJB3UN0xgMTNyuYx3eHExRp7tyCQO76VE8XLMUIk6t3sLKE4vlU8mJY9gkBOZsjtuBu2yxoCQLwn7k/aDUf1o9I4sOmaqx87gLihBly5u4QS14+KcUDCLlM/QniRGnA6m4d0R2UG0zbejXvYSO6NozzGIMZxgvDiaMYLh8aRBU/wuNhexMWKx5E+8mDavudhsrCR7EUEbi9+eun7IdgSATRw3wd6a7VkyFV/TIxgHBDIiFw1fCuQ0rgffdvTeb6VxTggkIn6EaI0KC/abJ7iWwWDaaE7zdzj2bdzQD/dm/HCMTuncYJpeVxsswbTMgrSsGBayMcueQRuI88Y8ulB78vWUk/bBY2iPj203hLVW9HwVGp+h6U7vJuhMJAhv6ORjAObqGp72hNLG/StUjDCQO5g7AAT9X6WvU3DiLGcq9icq1iOPhZzFfPRhwie+4kSE/EbYq5ifa6CZBnZettYvSVbb0d653M1WeaIM4dAngzKnBHy1WbPWcyzfCvrPDIMZEh3DKCJGjIRU3yrmA2wnpsDgQzYABAznDlTkRA1nw3QS7uHheVpFhaLw3OtI/ZIICAnzZbbWoLZFfI3On9vR82Wk0Zkmk1uuklAnnT2OyAT9W7W5xROs8mTfCvLTYKBtH2rASRuKk022Gy+71uFfWTH3YX0zh5HyChezaZs8If+OuO4v9bhWT2AjORjafw0yEZdQL1NWLOqnG9Xg7YkHvXpAeNF30KXK1edNatc/agW7UEgV/0Ig7i3xRD3rWLBtE5uBb4FBeHJx1LaOZDl94fOjOLNsHPcvYDEYFrYSPK9gAkyiuPibiBYvQ3tBTR2MG16ghQYT3Z1D9gpupv1kNEtB0yib5WvHxUPgEB2MIgqLDYhl49HP3ric/YW7aUsg6kQyH7f5M/XYZnB7nmaWp1H3g+mtWTOFkwLGMnPAIhInLcyonjH6HrOco5vZc0PAMjsi3oaaaFNcd/KE7tCqUI2gJwfnAcuD/IOnRf6W4VikKY1nMgX1aMRQQKisq4rEg5cSuttIJZs/4CbPMfaLpBQ4YzrDkm70pQNlW6PXMK3ss4jXxIk9TRiuZ5SfasU3eEP01TBtJebrg8omuspUXccEk17qZG8OiTy1xdrbeXJ8vpW1re7DMgr5DtWGdzWPNy3snjgEiApxLR8j0m+VTSY1pFl3lxPx/PkzRzN9RTannZCf6tCqhdNn8yTE0zbu8G0Sicpop08aPnXVbdsyjBNV1saVBHZchU7cjUaTKufRz4W5BUy1rOTbK55661xFukA/ah44EiQlBdTciGm6cc6JbAtYOtbeVcO5MnT0MZyPVnrLjuhv3G5avjeVWzPTxAdNZJXSLNHdvKvatuakm/kSoH3HGsQo1d3ePMgHQPyChlndatEjF7dkYoxYQ1FER0B8gHl5NENhv5uGMNH2D3H4LW1sMVcC1Nn5wEZJ+zrZoIcuLdCf3st9DdZ5iTn0T13JB9wJNeTf613J/T3SN0heeA8kNTTyMije6Rv5V+XC+QkOQfkDV73tH17Lzu+lSRSNoCWR3fsB5nLZejlo0jxIh7V5pB6a1jfMh/Xtwgc5A0xW4o03PVOw/7eDik2ufXtEvKvQkHeIF+OoFAeXa9NbvtW/vPIIN/KOo8MA3mDfHkeXsW3ksG0GeMIA1njnZxdaeOofKttHLdkSrOegWleMzCJ4Ik1AxN/a94hmiFJXIrb0tuwr6Xd3upEyXLVFxMTZJz+AwAiz+q3Eyu0K1d1op3zyOfoxxIBIbLc8Jl55o/1rUJ2jienJYFCZCOZlEc30c5ptVxPWopQmTF0ZmlGWYCiSBGK6COLjBzKNc3oxGMN3dykDZ7gENlIipbM3KRrS6XZ28nsrUWkenus/8jmB3iiKpB7OWZ3/McG5j/mYBzOg8im616u4B2MXv9xapzUyyrwW7cBGpF62Y3h1nM+l+dCZCPpxrabOZ99iaJVmLrVW9SYuZ7OXc+hMufsURQgD5Y5R+oOqF70gLykb5W2vhqwAQ4ZRQHyEBtgy/WkVypgAbmsnsGglSaQ5Q200gSLn6jMyh29B5K3FGhYFlJQ3dvpbYZN3sZt8no4DqLgyXhti/BxvIRcT0Df6iBeVNf71/KtYvuP1jgeOorsepftIwf3H7UQ17TSPf5KPgfy4gbygEJDfK0jNx7AL1cPnqjiel8C16zScj1l6sfDJ6q43v1HfCuGcbkMRAZyrxabsnPq2BoyX9ZHcnVdK49HZHk8QuhNRPEiubqOxAo9UnsB5FIQ2XTdWpINW71V3VO9RUjuXKy9RSl+x05txP5yEDlPQvd0vHl0YfrxohAZyPP25rLOI3viV3n4+2UhMpByCcX2gdJj5o08uhm+lSS68CgKkMm+VevfKz9Pd7wCRA7yPN0Rz/W0k5wZohcBm7BvtlTSKbVhHYwooXDqROU1GuXjMq2FU8vP+f2ty3ipSe/1vmSaQaYfNGvD8vSDtD9abyfZ20701pNHdz+WrJZJ0iAT9QZ35X0+2ZvynFgysO4A+Ys3mE0qGMhzY+azz82VE2QUWyyMZxDItDKvgVxPPJBV3oftbv3Zeiw/5/fzNEliAgI5Ov0Id09/3POtQjwwACDe4O2DA3kyN9b6HP3YgyDq55FhIKFrj9a58pSzD5BRZLyoC0CACnmjrZ/54oVDZx9U4dSJl0RFbK0O8aKnk1YD1SqcSgAQT52q2Cpbgo2kXFn099Yu8yremmNnkUJyFcaLbp4H2HQFnEXK148dCKIvXwcA5NtX8a0mAMRm9m++AHjyben6QKm5nhy5ynfe3P0wiEQ9YXPLb5segJJTb93e6rVhzd5W2bme6PyATNQT9udBYpMKBjIeLxzJ9ZRSwAgibk44lusJBDK+p+3LoytroGI9ZAAbNVB5nAF9hCiNdjBCKVTorwylIDDBIyJw1zKv2C3zKpYMeVRETg6Eavw7vz8nvJdfDsiTl8n1BJuo+3kCYSDPy/UU8K060Cju5NHlHxcA8mMk15PjWyUXTiXfABCnpGKPBAYytaxkKEeQY5N3EIg4If8q/+AgkAfnegJCTM+jCwN5Xq4naxxHAMQW5+RDBoFMHMekwqkgXuyziq+SKwjINH5MkauQUTxhK+wnIlfFhi8I5FG5nmC8mJ9nHgDyy0G5ngYARNRA6gUAzLovibme4oVTIRBPKPvwFzc9QSO5nW+bzfNtquFdv2P4CoCIUzZ8nWDaGjpdgXl0FeNAILY4aVPbCaZlRCCQCfmsAmdjGFUPgIhGuTFRrRgruWkZWCbSas1A9OSX0rIBqu3M0H6upw4yio2505xbFwk2XcG+FWyinlvfCgDyGpzrqfsLBDFepywhtQII5G6uJ6MGqlh5nqYSMIpVL2ugyt9Q1Vb56rXW0sxb6q3CqZIIYtZdl2ZLa5lXbx5dtd8xgkYxq26g2rpwiB4gIPN9K+BEPaj+Iwxk5nlkCMQG79TxDIX+6nU8JRFouob2H/3pkQhkFPsjEjPJa4IJHu/ljQdoxp8AiDijrm4w9Hc7jwzkyUTfqhpgvHhwfeSb/E58So6ZRwCIc2OVrFZ2Tmx7OlIcm6lzgFn3SR2YsHM9zWTNnsQil/p8iE/tKH+jE7+BiZu0UEQ/GRVbzYatiq0YNpJuekQnXq7p8nnxqcVys6s+I5i20omEGoBN1908ujBxY55HPqI+svhOMJCRmHleIxwwih128rrqQa/h1LWWg+AjAqiQT95cT5vMAYziU9tExEe9BpmkpQM1ciCwr3CCgIyct4LoRcqLVi6L+gzdYeSyEGd1YSBd30o2BYFYYztfhzhQc07ob2XkegLw5C/zXIBWOLUHQJw7sfilFuG0BFEqtXt6snR/bVjIrtan0pvrqZr/zf6pf9rGyfWki4/Ysq27KBEgmqE86eR6gvDiPzX25rI4TndIFgCA/OX6Vj0CQMSNPydJUjBtwLfyxwuD9KSe66kbhn7Jn6g/cK8VAsk6NBkoJhImmkAjaeR6akYAxKqJxMW2cd9qTz+60wPIk6t+bBAEIo7kejrCt7LOI8N4ctWPGABxbKLxzcfYOUauJ4DT/EuM4zzPJH+R8UfTqRqoi6ryteg1UOnNKPOqTu17iYYkIgIYyS+lyPU05hebeKlwLNeTP0FUnSVXfXkeACDvuH7E+aY95cVorqfD9aMiAoAkzLfqfueSvfRVNNeT7SZl2jmxXE/5Zt0n5ltlb1C/8DnmqYHKZc6WdMcq8yqKUXrKvMaI7FQ4gJFscZG9q/HS4GiuJ9Pv2AJNAX6HLw9SNsiPqBjzIcbzWV0YY7ZZ9zQUmVP1ZeAlWkm55iVrVFxsw7OF8RqopGyYVJIpxkoV+isLpyqiMo2o14hKQIjLTXGdB7FRu8R/RubwZdvM6fqYV6boucG20fWqukOaiHkg3xY/ciAyZyqS6yngW/mDaQE2wLqNkgUyK13K8zx4a6Cy8qqjv65ruMxrgCheG1Y9TjmCJwfjs9RaSflXWzNkFGaTR/KvZozkh/S5SnkxPY/uBXwri83bDIyp0XDPbGcqkutpZxy9hVNzfGSHKHkkPxaJTsczGvzrFIO7ThFftgCtdXiIkpc/bou0xMXPssp5Un7yeFLzZLm6m588cbq2RdKLz9gOf/+j+lGdt0obybJICYl7Zs5UJNfTpdeQg7meUpY/Pib5Vs98wT5e9yFvLyBewsHaC4gQpUzXluV62tMev+UOalL9jgvs6URzPe1O1w8dW3vcsRkoL6bXYdEwHrU3t5PraW8k5dpj1PV4Jo0/X0c8J/hufI4R95gpro2lsPgQ3VIqtm8V25P7jarSm+spw7c6Z688IY9ubCTZUrmItSYvYYiQHOyvpTskC9RBiJ/Hbd9qCozkT2bAeeaHt06ZPqkiROFgWp3I9q2idcpwAOKHYcv1NBE/T34pPTVQA/XmpjUGyVekLrvMaxbR5D9EfLvIGKRSWLnk9Gy/8nLVZdQNDIeFScbJiCXT4zoS8+i62RS+nUjpxHXcGRbP13s628E1Si7vW9lsPr0z1sK/33VrNnU9roPUt1++Pz89PX//cjucV4flEIy2foxiHHB3ur3+/PL09O/3t1eEHQNSGP8Hw7ibnuwd24oAAAAASUVORK5CYII="></img></button>
        <div className="flex absolute bottom-0 items-center ">
        <input type="checkbox"  onClick={()=>changelocal()} className="w-[20px] h-[20px] bg-black"></input>
        <div className="text-center  inline">하루동안 안보기</div>
        </div>
        <div className=" w-full h-[100px] absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center align-middle">
        {weather !== null ? (
            <>
            {weather.weathers}<br />
            상세 날씨를 꼭 확인해주세요!
            </>
            ) : "평소와 다름없는 날씨내요 좋은 하루되세요!"}
         
        </div>
    </div>);


}

export default WeatherModal;
