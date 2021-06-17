Given a **formula** below
$$
s = ut + \frac{1}{2}at^{2}
$$
Calculate the value of $s$ when $u = 10\frac{m}{s}$ and $a = 2\frac{m}{s^{2}}$ at $t = 1s$



// ------------------------


                #include <stdio.h>
                int main() {    
                
                    int number1, number2, sum;
                    int T;
                
                    scanf("%d", &T);
                
                    while(T--){
                        scanf("%d %d", &number1, &number2);
                        sum = number1 + number2;
                        printf("%d",sum);
                    }
                    return 0;
                }
                
                autocannon http://localhost:5000/api/v1/questions/details/all?Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDg3Y2JkOTJkYWI1ODFkMWM2OWZjMzMiLCJpYXQiOjE2MjM0Nzg1NzQsImV4cCI6MTYyODQ3ODU3NH0.k1n1CgCdo4LGNNgzWLwFKeeLQGptYNlfeTvv-jmvEUQ -d 10 -m POST -c 30 -w 3              