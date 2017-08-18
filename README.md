# Slide Puzzle

An algorithm that can solve slide puzzle of `nxn`. Build using plain javascript and jquery.

## Algorithm Optimization

At current state the algorithm is about 60.8% optimized. Here is the history of algorithm optimization history.

| # | avg moves | moves if algo fails |    failure %   | Optimization % |
|:-:|:---------:|:-------------------:|:--------------:|:--------------:|
| 1 |    764    |       950-1150      | 0.6(0.3H,0.3S) |       0%       |
| 2 |    756    |       940-1140      | 0.6(0.3H,0.3S) |     0.01 %     |
| 3 |    753    |     Never Fails     |       0%       |     0.014 %    |
| 4 |    327    |     Never Fails     |       0%       |     57.1 %     |
| 5 |    299    |     Never Fails     |       0%       |     60.8 %     |

## TODO

* Optimize moves for 2x2