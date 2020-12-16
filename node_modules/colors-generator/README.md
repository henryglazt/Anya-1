# colors-generator

generate colors in same lightness and purity from a base color

## api

```
generate('#86bff2', 10).get() => ["#86bff2", "#8e86f2", "#cf86f2", "#f286d5", "#f28694", "#f2b986", "#eaf286", "#a9f286", "#86f2a3", "#86f2e4"]
```

![](https://img.alicdn.com/tfs/TB1FEnmQFXXXXcjXVXXXXXXXXXX-1379-145.png)

```
generate('#86bff2', 10).lighter(0.1).get()
```

![](https://img.alicdn.com/tfs/TB1DOLFQFXXXXceXpXXXXXXXXXX-1382-132.png)


```
generate(color, num).darker(0.2).get()
```

![](https://img.alicdn.com/tfs/TB1uo2VQFXXXXXiXXXXXXXXXXXX-1376-117.png)

```
generate(color, num).purer(0.1).get()
```

![](https://img.alicdn.com/tfs/TB1xbPmQFXXXXceXVXXXXXXXXXX-1390-134.png)

```
generate(color, num).impurer(0.1).get()
```

![](https://img.alicdn.com/tfs/TB1FEnmQFXXXXcjXVXXXXXXXXXX-1379-145.png)

lightness and purity are both between [0, 1]
