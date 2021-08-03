from statistics import mean
from math import sqrt

data=[4,5,3.5,2.5,6.3,5.5]
def 산포도_외부함수(data1): #외부 함수(outer)
    data_set=data1
   #내부함수 : 산술평균 반환 
    def 산술평균_내부함수():
        avg_val=mean(data_set)
        return avg_val
    #내부함수 : 분산 반환
	
    
    def 분산_내부함수(avg):
        diff=[(data - avg)**2 for data in data_set]
        sum_diff=sum(diff)  #분산 값
        var_val=sum_diff/(len(data_set)-1)
        
        return var_val
	
    #내부함수 : 표준편차 반환
    def 표준편차_내부함수(var):
        return sqrt(var)
    
    return 산술평균_내부함수, 분산_내부함수, 표준편차_내부함수
산술평균, 분산, 표준편차=산포도_외부함수(data)
#내부함수 호출
v=분산(산술평균())
k=표준편차(v)
print('산술평균 :',산술평균())
print('분산 :',v)
print('표준편차 :',k)